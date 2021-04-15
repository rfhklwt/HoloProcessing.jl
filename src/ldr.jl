"""
    ldr(
        holo::AbstractMatrix{T}, 
        N::Integer, 
        interval::Tuple{Integer,Integer}, 
        P::FFTW.FFTWPlan, 
        scale::Integer; 
        shift = false
        ) -> AbstractMatrix{T} where T <: AbstractFloat
`低维度重建法`的算法实现，具体可见`doi: 10.1364/AO.414773`

# Arguments
- holo: 全息图
- N: 窗口大小的`N`倍就等于`holo`的大小
- interval: 窗口偏移量
- holo: 原始全息图
- P: 其类型为FFTW.FFTWPlan，表示重建采用`fft`傅立叶变换
- scale: 由于零级像强度过大，故需要用`scale`拉升±1级像的强度
- shift: 是否旋转图像，默认为否（除非是想展示完整的重建像，否则不建议将`shift`设为`true`，因为其内存和时间开销比较大）
"""
function ldr(holo::AbstractMatrix{T}, N::Integer, 
    interval::Tuple{Integer,Integer}, P::FFTW.FFTWPlan, scale::Integer; shift = false) where T <: AbstractFloat
    
    Nx, Ny = size(holo)
    # 计算子全息图的个数并进行预分配内存
    Dx, Dy = size(holo) .÷ N
    nx, ny = (size(holo) .- (Dx, Dy)) .÷ interval
    S = (nx + 1) * (ny + 1)
    holo_tensor = zeros(T, Dx, Dy, S)
    
    # 获取子全息图
    make_sub_holo!(holo_tensor, holo, (Dx, Dy), interval, (nx, ny))

    if typeof(P) <: FFTW.rFFTWPlan
        re_tensor = similar(holo, Dx ÷ 2 + 1, Dy, S)
        ldr_img = zeros(T, N * (Dx ÷ 2 + 1), Ny)
    elseif typeof(P) <: FFTW.cFFTWPlan
        re_tensor = similar(holo, Dx, Dy, S)
        ldr_img = zeros(T, Nx, Ny)
    else
        @error "P的类型不正确..."
    end

    # 对子全息图进行重建
    reconst_tensor!(re_tensor, holo_tensor, P, scale; shift = shift)

    # 随机混洗
    shuffle_tensor = @view re_tensor[:, :, randperm(size(re_tensor, 3))]

    # 降噪
    ldr_core!(ldr_img, re_tensor, N)
    
    return ldr_img
end

"""
    ldr_core!(ldr_img::AbstractMatrix{T}, re_tensor::AbstractArray{T,3}, N::Integer) -> AbstractMatrix where T <: AbstractFloat

`低维重建法`的核心降噪算法，对子再现像序列进行分组**平均**、**聚合**、再经过**均值滤波器**，最后结果存进`ldr_img`中

# Arguments
- ldr_img: 存放结果的矩阵
- re_tensor: 子再现像序列
- N: 分成`N`组
"""
function ldr_core!(ldr_img::AbstractMatrix{T}, re_tensor::AbstractArray{T, 3}, N::Integer) where T <: AbstractFloat
    dims_1, dims_2, _ = size(re_tensor)
    mean_tensor = similar(ldr_img, dims_1, dims_2, N^2)
    
    ldr_denoising!(mean_tensor, re_tensor, N)

    ldr_aggregation!(ldr_img, mean_tensor, N)

    return mapwindow!(mean, ldr_img, ldr_img, (3, 3))
end

"""
    ldr_denoising!(mean_tensor::AbstractArray{T, 3}, re_tensor::AbstractArray{T,3}, N::Integer) -> AbstractArray{T, 3} where T <: AbstractFloat

`低维重建法`的核心降噪算法中的**降噪**步骤，对子再现像序列`re_tensor`进行分组平均，其结果放到`mean_tensor`中

# Arguments
- mean_tensor: 存放结果的矩阵
- re_tensor: 子再现像序列
- N: 分成`N`组
"""
function ldr_denoising!(mean_tensor::AbstractArray{T, 3}, re_tensor::AbstractArray{T, 3}, N::Integer) where T <: AbstractFloat
    dims_1, dims_2, dims_3 = size(re_tensor)
    δ = dims_3 ÷ N^2

    @inbounds Threads.@threads for ind in CartesianIndices((1:dims_1, 1:dims_2, 1: δ: (dims_3 - δ)))
        i, j, k = ind.I
        mean_tensor[i, j, k ÷ δ + 1] = mean(@view re_tensor[i, j, k: (k + δ)])
    end

    return mean_tensor
end

"""
    ldr_aggregation!(ldr_img::AbstractArray{T, 3}, mean_tensor::AbstractArray{T,3}, N::Integer) -> AbstractMatrix where T <: AbstractFloat

`低维重建法`的核心降噪算法中的**聚合**步骤，将低维再现像聚合成高维再现像

# Arguments
- ldr_img: 存放结果的矩阵
- mean_tensor: 低维再现像序列
- N: 分成`N`组
"""
function ldr_aggregation!(ldr_img::AbstractMatrix{T}, mean_tensor::AbstractArray{T, 3}, N::Integer) where T <: AbstractFloat
    dims_1, dims_2, _ = size(mean_tensor)

    @inbounds Threads.@threads for ind in CartesianIndices((1: N, 1: N))
        i, j = ind.I
        ldr_img[i: N: end, j: N: end] .= @view mean_tensor[:, :, N*(i - 1) + j]
    end

    return ldr_img
end
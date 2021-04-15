"""
sdm(
    holo::AbstractMatrix{T}, 
    windows_size::Tuple{Integer,Integer}, 
    interval::Tuple{Integer,Integer}, 
    P::FFTW.FFTWPlan, 
    scale::Integer; 
    shift = false
    ) -> AbstractMatrix where T <: AbstractFloat

`空域掩膜法`的算法实现，具体可见`doi: 10.1109/JDT.2015.2479646`

- holo: 全息图（非RGB类型而是AbstractFloat类型）
- windows_size: 掩膜窗口大小
- interval: 窗口偏移量
- holo: 原始全息图
- P: 其类型为FFTW.FFTWPlan，表示重建采用`fft`傅立叶变换
- scale: 由于零级像强度过大，故需要用`scale`拉升±1级像的强度
- shift: 是否旋转图像，默认为否（除非是想展示完整的重建像，否则不建议将`shift`设为`true`，因为其内存和时间开销比较大）
"""
function sdm(holo::AbstractMatrix{T}, windows_size::Tuple{Integer,Integer}, 
    interval::Tuple{Integer,Integer}, P::FFTW.FFTWPlan, scale::Integer; shift = false) where T <: AbstractFloat
    
    # 计算子全息图的个数并进行预分配内存
    nx, ny = (size(holo) .- windows_size) .÷ interval
    S = (nx + 1) * (ny + 1)
    holo_tensor = zeros(T, size(holo, 1), size(holo, 2), S)
    
    # 获取子全息图
    make_sub_holo!(holo_tensor, holo, windows_size, interval, (nx, ny))

    if typeof(P) <: FFTW.rFFTWPlan
        re_tensor = similar(holo, size(holo, 1) ÷ 2 + 1, size(holo, 2), S)
        sdm_img = similar(holo, size(holo, 1) ÷ 2 + 1, size(holo, 2))
    elseif typeof(P) <: FFTW.cFFTWPlan
        re_tensor = similar(holo, size(holo, 1), size(holo, 2), S)
        sdm_img = similar(holo, size(holo, 1), size(holo, 2))
    else
        @error "P的类型不正确..."
    end

    # 对子全息图进行重建
    reconst_tensor!(re_tensor, holo_tensor, P, scale; shift = shift)

    # 求其均值
    sdm_core!(sdm_img, re_tensor)

    return sdm_img

end

"""
    sdm_core!(sdm_img::AbstractMatrix{T}, re_tensor::AbstractArray{T,3}) -> AbstractMatrix where T <: AbstractFloat

`空域掩膜法`的核心算法，对子再现像序列进行叠加平均，并存进`sdm_img`中

- sdm_img: 存放结果的矩阵
- re_tensor: 子再现像序列
"""
function sdm_core!(sdm_img::AbstractMatrix{T}, re_tensor::AbstractArray{T,3}) where T <: AbstractFloat
    dims1, dims2, _ = size(re_tensor)
    @inbounds Threads.@threads for ind in CartesianIndices((1:dims1, 1:dims2))
        i, j = ind.I
        sdm_img[i, j] = mean(@view re_tensor[i, j, :])
    end

    return sdm_img
end
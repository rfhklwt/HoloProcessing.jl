"""
rse(
    holo::AbstractMatrix{T}, 
    windows_size::Tuple{Integer,Integer}, 
    interval::Tuple{Integer,Integer}, 
    P::FFTW.FFTWPlan, 
    scale::Integer; 
    shift = false
    ) -> AbstractMatrix{T} where T <: AbstractFloat

`冗余散斑降噪法`的算法实现，具体可见`doi: 10.1364/AO.390500`

- holo: 全息图（非RGB类型而是AbstractFloat类型）
- windows_size: 掩膜窗口大小
- interval: 窗口偏移量
- holo: 原始全息图
- P: 其类型为FFTW.FFTWPlan，表示重建采用`fft`傅立叶变换
- scale: 由于零级像强度过大，故需要用`scale`拉升±1级像的强度
- shift: 是否旋转图像，默认为否（除非是想展示完整的重建像，否则不建议将`shift`设为`true`，因为其内存和时间开销比较大）
"""
function rse(holo::AbstractMatrix{T}, windows_size::Tuple{Integer,Integer}, 
    interval::Tuple{Integer,Integer}, P::FFTW.FFTWPlan, scale::Integer; shift = false) where T <: AbstractFloat
    
    # 计算子全息图的个数并进行预分配内存
    nx, ny = (size(holo) .- windows_size) .÷ interval
    S = (nx + 1) * (ny + 1)
    holo_tensor = zeros(T, size(holo, 1), size(holo, 2), S)
    
    # 获取子全息图
    make_sub_holo!(holo_tensor, holo, windows_size, interval, (nx, ny))

    if typeof(P) <: FFTW.rFFTWPlan
        re_tensor = similar(holo, size(holo, 1) ÷ 2 + 1, size(holo, 2), S)
        rse_img = zeros(T, size(holo, 1) ÷ 2 + 1, size(holo, 2))
    elseif typeof(P) <: FFTW.cFFTWPlan
        re_tensor = similar(holo, size(holo, 1), size(holo, 2), S)
        rse_img = zeros(T, size(holo, 1), size(holo, 2))
    else
        @error "P的类型不正确..."
    end

    # 对子全息图进行重建
    reconst_tensor!(re_tensor, holo_tensor, P, scale; shift = shift)

    # 求其均值
    rse_core!(rse_img, re_tensor)
    
    return rse_img

end

"""
    rse_core!(rse_img::AbstractMatrix{T}, re_tensor::AbstractArray{T,3}) -> AbstractMatrix where T <: AbstractFloat

`冗余散斑降噪法`的核心算法，对子再现像序列进行去冗余而后叠加平均，并存进`rse_img`中

- rse_img: 存放结果的矩阵
- re_tensor: 子再现像序列
"""
function rse_core!(rse_img::AbstractMatrix{T}, re_tensor::AbstractArray{T,3}) where T <: AbstractFloat
    dims1, dims2, dims3 = size(re_tensor)
    @inbounds Threads.@threads for ind in CartesianIndices((1:dims1, 1:dims2))
        i, j = ind.I
        hash_tab = Set{T}()
        clock = 0
        @inbounds for k in 1: dims3
            if re_tensor[i, j, k] ∉ hash_tab
                push!(hash_tab, re_tensor[i, j, k])
                rse_img[i, j] += re_tensor[i, j, k]
            clock += 1
            end
        end
        
        rse_img[i, j] /= clock
    end

    return rse_img
end
"""
    make_sub_holo!(
        tensor::AbstractArray{T,3}, 
        holo::AbstractMatrix{T}, 
        windows_size::Tuple{Integer,Integer}, 
        interval::Tuple{Integer,Integer}, 
        nums_of_holo::Tuple{Integer,Integer}
    ) -> AbstractArray{T,3} where T <: AbstractFloat

生成子全息图并将其存放到`tenosr`序列上

# Arguments
- tensor: 子全息图序列
- holo: 原始全息图
- windows_size: 掩膜窗口的大小
- interval: 窗口偏移量
- nums_of_holo: 子全息图的数量（与`tensor`的第三个维度一致）

# Notice
- 当子全息图大小与原始全息图一致时，则对位于窗口外的地方补零
- 当子全息图大小与掩膜窗口大小一致时，则抛弃窗口外的数据
"""
function make_sub_holo!(tensor::AbstractArray{T,3}, holo::AbstractMatrix{T}, 
    windows_size::Tuple{Integer,Integer}, interval::Tuple{Integer,Integer}, 
    nums_of_holo::Tuple{Integer,Integer}) where {T <: AbstractFloat}

    dx, dy = interval
    Dx, Dy = windows_size
    nx, ny = nums_of_holo
    # 如果tensor与holo相同维度，则把窗口外的地方补零，如果与windows同维度
    if size(tensor)[1:2] == size(holo)
        @inbounds Threads.@threads for ind in CartesianIndices((0:nx, 0:ny))
            i, j = ind.I
            tensor[1 + i * dx:Dx + i * dx, 1 + j * dy:Dy + j * dy, i * (ny + 1) + (j + 1)] .= @view holo[1 + i * dx:Dx + i * dx, 1 + j * dy:Dy + j * dy]
        end
    elseif size(tensor)[1:2] == windows_size
        @inbounds Threads.@threads for ind in CartesianIndices((0:nx, 0:ny))
            i, j = ind.I
            tensor[:, :, i * (ny + 1) + (j + 1)] .= @view holo[1 + i * dx:Dx + i * dx, 1 + j * dy:Dy + j * dy]
        end
    else
        @error "tensor的维度与全息图或者窗口大小不匹配..."
    end

    return tensor
end

"""
    reconst_tensor!(
        re_tensor::AbstractArray{T,3}, 
        holo_tensor::AbstractArray{T,3}, 
        P::FFTW.FFTWPlan, 
        scale::Integer; 
        shift = false
        ) -> AbstractArray{T,3} where T <: AbstractFloat

对子全息图序列进行数值重建并存放到`re_tensor`

# Arguments
- re_tensor: 子再现像序列
- holo_tensor: 子全息图序列
- P: 其类型为FFTW.FFTWPlan，表示重建采用`fft`傅立叶变换
- scale: 由于零级像强度过大，故需要用`scale`拉升±1级像的强度
- shift: 是否旋转图像，默认为否（除非是想展示完整的重建像，否则不建议将`shift`设为`true`，因为其内存和时间开销比较大）
"""
function reconst_tensor!(re_tensor::AbstractArray{T,3}, holo_tensor::AbstractArray{T,3}, 
    P::FFTW.FFTWPlan, scale::Integer; shift = false) where {T <: AbstractFloat}

    FFTW.set_num_threads(Sys.CPU_THREADS)
    @inbounds Threads.@threads for k in 1:size(holo_tensor, 3)
        re_tensor[:, :, k] .= reconst((@view holo_tensor[:, :, k]), P, scale; shift = shift)
    end
    return re_tensor
end
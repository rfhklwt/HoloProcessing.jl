"""
    brightness(c) -> Float64

对给定的颜色三通道`像素值`，求出其亮度并以浮点数的形式输出

注意: 由于实验中记录的全息图都是灰度图像，其三个通道分量颜色都是一致的，故取某一颜色分量作为其亮度即可

- c: RGB类型的像素值
"""
brightness(c::AbstractRGB) = c.r |> Float64

"""
    brightness(::AbstractMatrix{T}) -> AbstractMatrix{Float64}

对给定的颜色三通道`图像`，求出其亮度并以`浮点数`的形式输出

注意: 由于实验中记录的全息图都是灰度图像，其三个通道分量颜色都是一致的，故取某一颜色分量作为其亮度即可
"""
brightness(img::AbstractMatrix{<:AbstractRGB}) = brightness.(img)

"""
    load_holo(PATH::String, name::String; convert=true) -> AbstractMatrix

给定`图像`路径以及`图像`的名称(包括后缀)，实现对全息图的载入

- `PATH`: `图像`所在路径
- `name`: `图像`的名称，比如`tail.bmp`
- `convert`: 可选参数，默认值是`true`。当为`true`时，该函数返回`图像`的灰度值浮点数矩阵；当为`false`时，该函数直接返回图像
"""
function load_holo(PATH::String, name::String; convert = true)
    img = load(joinpath(PATH, name), view = true)

    return (convert == true) ? brightness(img) : img
end

function _normalize(x::AbstractMatrix)
    min_value, max_value = minimum(x), maximum(x)
    min_max = max_value - min_value
    return (x .- min_value) ./ min_max
end

function _normalize!(x::AbstractMatrix)
    min_value, max_value = minimum(x), maximum(x)
    min_max = max_value - min_value

    for i in eachindex(x)
        x[i] = (x[i] - min_value) / min_max
    end

    return x
end

function _normalize_threads(x::AbstractMatrix)
    min_value, max_value = minimum(x), maximum(x)
    min_max = max_value - min_value
    src = similar(x, size(x))

    @inbounds Threads.@threads for i in eachindex(x)
        src[i] = (x[i] - min_value) / min_max
    end

    return src
end

function _normalize_threads!(x::AbstractMatrix)
    min_value, max_value = minimum(x), maximum(x)
    min_max = max_value - min_value

    @inbounds Threads.@threads for i in eachindex(x)
        x[i] = (x[i] - min_value) / min_max
    end

    return x
end

"""
    normalize(x::AbstractMatrix; nthreads=false) -> AbstractMatrix

对矩阵`x`进行归一化，并返回归一化后的矩阵

- `x`: 矩阵
- `nthreads`: 决定是否开多线程来进行归一化，默认为否
注意：对于不大的矩阵（低于10_000 × 10_000），不建议开多线程，这是因为多线程会有额外的内存和时间开销
"""
normalize(x::AbstractMatrix; nthreads = false) =
    nthreads ? _normalize_threads(x) : _normalize(x)

"""
    normalize!(x::AbstractMatrix; nthreads=false) -> AbstractMatrix

对矩阵`x`进行`原地`归一化，即原地修改矩阵并返回修改后的`x`

- `x`: 矩阵
- `x`: 矩阵
- `nthreads`: 决定是否开多线程来进行归一化，默认为否
注意：对于不大的矩阵（低于10_000 × 10_000），不建议开多线程，这是因为多线程会有额外的内存和时间开销
"""
normalize!(x::AbstractMatrix; nthreads = false) =
    nthreads ? _normalize_threads!(x) : _normalize!(x)

"""
    color(x::AbstractMatrix{<:AbstractFloat}) -> AbstractMatrix
将浮点数类型矩阵转换为灰度图像
- x: 浮点数矩阵
"""
color(x::AbstractMatrix{<:AbstractFloat}) = Gray.(x)

"""
    reconst(holo::AbstractMatrix, P::FFTW.FFTWPlan, scale::Integer; shift=false) -> AbstractMatrix
对无透镜傅立叶全息图进行数值重建

其中
- `holo`: 无透镜傅立叶全息图
- `P`: 其类型为FFTW.FFTWPlan，表示重建采用`fft`傅立叶变换
- `scale`: 由于零级像强度过大，故需要用`scale`拉升±1级像的强度
- `shift`: 是否旋转图像，默认为否（除非是想展示完整的重建像，否则不建议将`shift`设为`true`，因为其内存和时间开销比较大）
- `nthreads`: 是否开启多线程，默认为是（值得注意的是，该线程与傅立叶变换多线程的开启无关）
"""
function reconst(
    holo::AbstractMatrix,
    P::FFTW.FFTWPlan,
    scale::Integer;
    shift = false,
    nthreads = true,
)
    if shift
        fft_img =
            @pipe fftshift(P * fftshift(holo)) .|> abs |> normalize!(_, nthreads = nthreads)
    else
        fft_img = @pipe P * holo .|> abs |> normalize!(_, nthreads = nthreads)
    end
    fft_img .*= scale
    return clamp!(fft_img, 0, 1)
end

"""
    contrast(img::AbstractMatrix) -> AbstractFloat

计算图像`img`的对比度
"""
contrast(img::AbstractMatrix) = std(img) / mean(img)

"""
    ssi(; noised::AbstractMatrix{T}, filtered::AbstractMatrix{T})) -> AbstractFloat  where T

计算图像`img`的SSI值

- `noised`: 噪声图像
- `filtered`: 降噪后的图像
"""
ssi(; noised::AbstractMatrix{T}, filtered::AbstractMatrix{T}) where T = contrast(filtered) / contrast(noised)

"""
    smpi(; noised::AbstractMatrix{T}, filtered::AbstractMatrix{T})) -> AbstractFloat  where T

计算图像`img`的SMPI值

- `noised`: 噪声图像
- `filtered`: 降噪后的图像
"""
smpi(; noised::AbstractMatrix{T}, filtered::AbstractMatrix{T}) where T = (1 + abs(mean(filtered) - mean(noised))) * (std(filtered) / std(noised))

"""
    enl(img::AbstractMatrix) -> AbstractFloat

计算图像`img`的`ENL`值
"""
enl(img::AbstractMatrix) = (mean(img) / std(img)) ^2
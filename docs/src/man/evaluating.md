# 质量评价指标

## 图像对比度（Contrast，C）

```math
\mathrm{C} = \frac{\mu_{\mathrm{I}}}{\sigma_{\mathrm{I}}}
```

其中``\mu_{\mathrm{I}}``和``\sigma_{\mathrm{I}}``分别表示图像的平均值及其标准差。 

```julia
C = contrast(img)
```

## 等效视数（Equivalent Number of Looks，ENL）

```math
\mathrm{ENL} = \left(\frac{\mu_{\mathrm{I}}}{\sigma_{\mathrm{I}}}\right)^2
```

其中``\mu_{\mathrm{I}}``和``\sigma_{\mathrm{I}}``分别表示图像的平均值及其标准差。 `ENL`通常用于测量不同的降噪滤波器的性能好坏，当ENL值较大时，表明图像比较平滑，这意味着图像的噪点突刺比较少，滤波器的降噪性能较好。

```julia
ENL = enl(img)
```



## 散斑抑制系数（Speckle Suppression Index，SSI）

```math
\mathrm{SSI} = \frac{\sigma_{\mathrm{f}}}{\mu_{\mathrm{f}}} \cdot \frac{\mu_{\mathrm{o}}}{\sigma_{\mathrm{o}}}
```

其中``\sigma_{\mathrm{o}}``和 ``\mu_{\mathrm{o}}``分别表示原始图像的标准差和均值。 类似地，``\sigma_{\mathrm{f}}``和``\mu_{\mathrm{f}}``分别是经过降噪滤波器降噪后的图像的标准差和均值。通常来说，图像的均值表示它的信息，而图像的标准差则表示它的噪声严重程度，因此，`SSI`越小意味着降噪滤波器的性能越好。

```julia
SSI = ssi(noised=noised_img, filtered=filtered_img)
```



## 散斑抑制和均值保持指数（Speckle Suppression and Mean Preservation Index，SMPI）

```math
\mathrm{SMPI}=\left(1+\left|\mu_{\mathrm{f}}-\mu_{\mathrm{o}}\right|\right) \cdot \frac{\sigma_{\mathrm{f}}}{\sigma_{\mathrm{o}}}
```

与`ENL`和`SSI`相比，`SMPI`考虑了降噪后的图像和降噪前的图像之间的均值差异。当降噪后的图片均值过于偏离原有的图片均值时，`SMPI`的数值的可信度高于`ENL`和`SSI`。理论上，较小的`SMPI`值表示在均值保持和降噪方面，滤波器具有更好的性能。

```julia
SMPI = smpi(noised=noised_img, filtered=filtered_img)
```
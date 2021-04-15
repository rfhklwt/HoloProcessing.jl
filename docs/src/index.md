# HoloProcessing.jl

## Package Features

该包主要分三大模块：

* 标准全息处理：
  * 全息的读取
  * 全息的重建（仅实现无透镜傅立叶变换全息的数值重建）
* 全息降噪算法
  * 空域掩膜法（SDM）
  * 冗余散斑降噪法（RSE）
  * 低维重建法（LDR）

* 质量评价指标
  * Contrast
  * ENL
  * SMPI
  * SSI

## Manual Outline

```@contents
Pages = [
    "man/processing.md",
    "man/denoising.md",
    "man/evaluating.md",
]
Depth = 1
```


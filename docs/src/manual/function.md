# 函数库

## 全息处理

```@docs
HoloProcessing.brightness
HoloProcessing.load_holo
HoloProcessing.normalize
HoloProcessing.normalize!
HoloProcessing.color
HoloProcessing.reconst
```

## 全息降噪
```@docs
HoloProcessing.make_sub_holo!
HoloProcessing.reconst_tensor!
```

### 空域掩膜法实现
```@docs
HoloProcessing.sdm
HoloProcessing.sdm_core!
```

### 冗余散斑降噪法实现
```@docs
HoloProcessing.rse
HoloProcessing.rse_core!
```

### 低维重建法实现
```@docs
HoloProcessing.ldr
HoloProcessing.ldr_core!
HoloProcessing.ldr_denoising!
HoloProcessing.ldr_aggregation!
```

## 评价方法
```@docs
HoloProcessing.contrast
HoloProcessing.ssi
HoloProcessing.smpi
HoloProcessing.enl
```
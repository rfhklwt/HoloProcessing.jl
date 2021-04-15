# 标准全息处理

## 全息图的读取

### 读取全息图，并将其转换为`Float64`类型的二维矩阵

```julia
holo = load_holo(path, "xxx.bmp"; convert=true)
```

其中：

- `path` 是存放全息图的路径
- `"xxx.bmp" `是全息图的名称（实验中全息图都是以及`bmp`格式存放的）
- `convert`表示是否将其转换为`Float64`的矩阵

## 全息图的再现

### 对全息图实现数值再现（针对无透镜傅立叶变换全息图）

#### 开启多线程

!!! note
    首先需要注意的是，由于`julia`的傅立叶变换实现是**默认不开多线程**（而`matlab`的傅立叶变换是默认开多线程的，这也是为什么如果直接使用`fft`函数，`julia`的性能会比`matlab`差）。因此，需要在建立`P`（后面会解释这个`P`是什么）之前**开启**傅立叶变换的多线程，如下：

```julia
FFTW.set_num_threads(Sys.CPU_THREADS)
```

其中，`Sys.CPU_THREADS`表示我们`cpu`核心数的最大数量，比如在`12`核`cpu`上，输入`Sys.CPU_THREADS`，则显示如下：

```julia
julia> Sys.CPU_THREADS
12
```

#### 高效的傅立叶变换的实现

正常情况下，对图像进行傅立叶变换，其代码如下:

```julia
fft_img = fft(holo)

# 或者
fft_img = fftshift(fft(fftshit(holo)))
```

其中是否加上`fftshifts`其关系不大，`fftshift`的作用仅仅是对图像进行旋转而已。  

在实际的实现中，考虑到会多次执行傅立叶变换的操作。因此，一个更加具备效率的做法是

```julia
P = plan_fft(holo)
fft_img = P * holo
```

在这里`P`是`FFTW.cFFTWPlan`，表示以后都打算对与`holo`同个**维度**的矩阵进行傅立叶变换。


另外，由于我们知道无透镜傅立叶变换全息图的再现像，其`+1级`和`-1级`都是一样的。因此，为了提高效率和节省空间，我们并不需要重建出完整的图像，而是可以重建出一半即可，这通过改变`P`即可做到：

```julia
P = plan_rfft(holo)
fft_img = P * holo
```

#### 总结

* 总的来说，一个开启了多线程的全息图数值重建代码范例（`High Performance`）如下：

```julia
FFTW.set_num_threads(Sys.CPU_THREADS)
Pr = plan_rfft(holo)
# scale是手动调整的
scale = 1500
re_img = reconst(holo, Pr, scale; nthreads=true)
```

* 如果你坚持要完整的重建像，则范例如下：

```julia
FFTW.set_num_threads(Sys.CPU_THREADS)
P = plan_fft(holo)
# scale是手动调整的
scale = 1500
re_img = reconst(holo, P, scale; nthreads=true)
```

* 如果你还需要对图像进行旋转（建议仅在需要观测合适的重建像时使用），则范例如下

```julia
FFTW.set_num_threads(Sys.CPU_THREADS)
P = plan_fft(holo)
# scale是手动调整的
scale = 1500
re_img = reconst(holo, P, scale; shift=true, nthreads=true)
```


!!! note
    你可能不确定`shift`采用`true`还是`false`，我建议你都试一下，然后用`imshow`函数看一下图像的区别。

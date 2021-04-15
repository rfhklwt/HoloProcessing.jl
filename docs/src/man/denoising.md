# 全息降噪算法

## 空域掩膜法（SDM）

一个简单的演示案例如下：

```julia
holo = load_holo(path, "xxx.bmp"; convert=true)
FFTW.set_num_threads(Sys.CPU_THREADS)
P = plan_rfft(holo)	# or P = plan_fft(holo)
# Parameter
N = 2
Nx, Ny = size(holo) .÷ N
Dx, Dy = 50, 100
scale = 600

sdm_img = sdm(holo, (Nx, Ny), (Dx, Dy), P, scale)
```

!!! note
    更多的用法，可以通过输入如下：

    ```shell
    >julia?
    help>sdm
    ```

    来获取`sdm`函数的更多用法．

## 冗余散斑降噪法（RSE）

一个简单的演示案例如下：

```julia
holo = load_holo(path, "xxx.bmp"; convert=true)
FFTW.set_num_threads(Sys.CPU_THREADS)
P = plan_rfft(holo)	# or P = plan_fft(holo)
# Parameter
N = 2
Nx, Ny = size(holo) .÷ N
Dx, Dy = 50, 100
scale = 600

sdm_img = rse(holo, (Nx, Ny), (Dx, Dy), P, scale)
```

!!! note
    更多的用法，可以通过输入如下：

    ```shell
    >julia?
    help>rse
    ```

    来获取`rse`函数的更多用法．

## 低维重建法（LDR）

一个简单的演示案例如下：

```julia
holo = load_holo(path, "xxx.bmp"; convert=true)
FFTW.set_num_threads(Sys.CPU_THREADS)

# Parameter
N = 2
P = plan_rfft(similar(holo, size(holo) .÷ N))
# or P = plan_fft(similar(holo, size(holo) .÷ N))

Dx, Dy = 50, 100
scale = 600

ldr_img = ldr(holo, N, (Dx, Dy), P, scale)
```
!!! note
    更多的用法，可以通过输入如下：

    ```shell
    >julia?
    help>ldr
    ```

    来获取`ldr`函数的更多用法．
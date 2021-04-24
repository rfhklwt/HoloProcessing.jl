var documenterSearchIndex = {"docs":
[{"location":"man/evaluating/#质量评价指标","page":"评价指标","title":"质量评价指标","text":"","category":"section"},{"location":"man/evaluating/#图像对比度（Contrast，C）","page":"评价指标","title":"图像对比度（Contrast，C）","text":"","category":"section"},{"location":"man/evaluating/","page":"评价指标","title":"评价指标","text":"mathrmC = fracmu_mathrmIsigma_mathrmI","category":"page"},{"location":"man/evaluating/","page":"评价指标","title":"评价指标","text":"其中mu_mathrmI和sigma_mathrmI分别表示图像的平均值及其标准差。 ","category":"page"},{"location":"man/evaluating/","page":"评价指标","title":"评价指标","text":"C = contrast(img)","category":"page"},{"location":"man/evaluating/#等效视数（Equivalent-Number-of-Looks，ENL）","page":"评价指标","title":"等效视数（Equivalent Number of Looks，ENL）","text":"","category":"section"},{"location":"man/evaluating/","page":"评价指标","title":"评价指标","text":"mathrmENL = left(fracmu_mathrmIsigma_mathrmIright)^2","category":"page"},{"location":"man/evaluating/","page":"评价指标","title":"评价指标","text":"其中mu_mathrmI和sigma_mathrmI分别表示图像的平均值及其标准差。 ENL通常用于测量不同的降噪滤波器的性能好坏，当ENL值较大时，表明图像比较平滑，这意味着图像的噪点突刺比较少，滤波器的降噪性能较好。","category":"page"},{"location":"man/evaluating/","page":"评价指标","title":"评价指标","text":"ENL = enl(img)","category":"page"},{"location":"man/evaluating/#散斑抑制系数（Speckle-Suppression-Index，SSI）","page":"评价指标","title":"散斑抑制系数（Speckle Suppression Index，SSI）","text":"","category":"section"},{"location":"man/evaluating/","page":"评价指标","title":"评价指标","text":"mathrmSSI = fracsigma_mathrmfmu_mathrmf cdot fracmu_mathrmosigma_mathrmo","category":"page"},{"location":"man/evaluating/","page":"评价指标","title":"评价指标","text":"其中sigma_mathrmo和 mu_mathrmo分别表示原始图像的标准差和均值。 类似地，sigma_mathrmf和mu_mathrmf分别是经过降噪滤波器降噪后的图像的标准差和均值。通常来说，图像的均值表示它的信息，而图像的标准差则表示它的噪声严重程度，因此，SSI越小意味着降噪滤波器的性能越好。","category":"page"},{"location":"man/evaluating/","page":"评价指标","title":"评价指标","text":"SSI = ssi(noised=noised_img, filtered=filtered_img)","category":"page"},{"location":"man/evaluating/#散斑抑制和均值保持指数（Speckle-Suppression-and-Mean-Preservation-Index，SMPI）","page":"评价指标","title":"散斑抑制和均值保持指数（Speckle Suppression and Mean Preservation Index，SMPI）","text":"","category":"section"},{"location":"man/evaluating/","page":"评价指标","title":"评价指标","text":"mathrmSMPI=left(1+leftmu_mathrmf-mu_mathrmorightright) cdot fracsigma_mathrmfsigma_mathrmo","category":"page"},{"location":"man/evaluating/","page":"评价指标","title":"评价指标","text":"与ENL和SSI相比，SMPI考虑了降噪后的图像和降噪前的图像之间的均值差异。当降噪后的图片均值过于偏离原有的图片均值时，SMPI的数值的可信度高于ENL和SSI。理论上，较小的SMPI值表示在均值保持和降噪方面，滤波器具有更好的性能。","category":"page"},{"location":"man/evaluating/","page":"评价指标","title":"评价指标","text":"SMPI = smpi(noised=noised_img, filtered=filtered_img)","category":"page"},{"location":"man/processing/#标准全息处理","page":"标准全息处理","title":"标准全息处理","text":"","category":"section"},{"location":"man/processing/#全息图的读取","page":"标准全息处理","title":"全息图的读取","text":"","category":"section"},{"location":"man/processing/#读取全息图，并将其转换为Float64类型的二维矩阵","page":"标准全息处理","title":"读取全息图，并将其转换为Float64类型的二维矩阵","text":"","category":"section"},{"location":"man/processing/","page":"标准全息处理","title":"标准全息处理","text":"holo = load_holo(path, \"xxx.bmp\"; convert=true)","category":"page"},{"location":"man/processing/","page":"标准全息处理","title":"标准全息处理","text":"其中：","category":"page"},{"location":"man/processing/","page":"标准全息处理","title":"标准全息处理","text":"path 是存放全息图的路径\n\"xxx.bmp\"是全息图的名称（实验中全息图都是以及bmp格式存放的）\nconvert表示是否将其转换为Float64的矩阵","category":"page"},{"location":"man/processing/#全息图的再现","page":"标准全息处理","title":"全息图的再现","text":"","category":"section"},{"location":"man/processing/#对全息图实现数值再现（针对无透镜傅立叶变换全息图）","page":"标准全息处理","title":"对全息图实现数值再现（针对无透镜傅立叶变换全息图）","text":"","category":"section"},{"location":"man/processing/#开启多线程","page":"标准全息处理","title":"开启多线程","text":"","category":"section"},{"location":"man/processing/","page":"标准全息处理","title":"标准全息处理","text":"note: Note\n首先需要注意的是，由于julia的傅立叶变换实现是默认不开多线程（而matlab的傅立叶变换是默认开多线程的，这也是为什么如果直接使用fft函数，julia的性能会比matlab差）。因此，需要在建立P（后面会解释这个P是什么）之前开启傅立叶变换的多线程，如下：","category":"page"},{"location":"man/processing/","page":"标准全息处理","title":"标准全息处理","text":"FFTW.set_num_threads(Sys.CPU_THREADS)","category":"page"},{"location":"man/processing/","page":"标准全息处理","title":"标准全息处理","text":"其中，Sys.CPU_THREADS表示我们cpu核心数的最大数量，比如在12核cpu上，输入Sys.CPU_THREADS，则显示如下：","category":"page"},{"location":"man/processing/","page":"标准全息处理","title":"标准全息处理","text":"julia> Sys.CPU_THREADS\n12","category":"page"},{"location":"man/processing/#高效的傅立叶变换的实现","page":"标准全息处理","title":"高效的傅立叶变换的实现","text":"","category":"section"},{"location":"man/processing/","page":"标准全息处理","title":"标准全息处理","text":"正常情况下，对图像进行傅立叶变换，其代码如下:","category":"page"},{"location":"man/processing/","page":"标准全息处理","title":"标准全息处理","text":"fft_img = fft(holo)\n\n# 或者\nfft_img = fftshift(fft(fftshit(holo)))","category":"page"},{"location":"man/processing/","page":"标准全息处理","title":"标准全息处理","text":"其中是否加上fftshifts其关系不大，fftshift的作用仅仅是对图像进行旋转而已。  ","category":"page"},{"location":"man/processing/","page":"标准全息处理","title":"标准全息处理","text":"在实际的实现中，考虑到会多次执行傅立叶变换的操作。因此，一个更加具备效率的做法是","category":"page"},{"location":"man/processing/","page":"标准全息处理","title":"标准全息处理","text":"P = plan_fft(holo)\nfft_img = P * holo","category":"page"},{"location":"man/processing/","page":"标准全息处理","title":"标准全息处理","text":"在这里P是FFTW.cFFTWPlan，表示以后都打算对与holo同个维度的矩阵进行傅立叶变换。","category":"page"},{"location":"man/processing/","page":"标准全息处理","title":"标准全息处理","text":"另外，由于我们知道无透镜傅立叶变换全息图的再现像，其+1级和-1级都是一样的。因此，为了提高效率和节省空间，我们并不需要重建出完整的图像，而是可以重建出一半即可，这通过改变P即可做到：","category":"page"},{"location":"man/processing/","page":"标准全息处理","title":"标准全息处理","text":"P = plan_rfft(holo)\nfft_img = P * holo","category":"page"},{"location":"man/processing/#总结","page":"标准全息处理","title":"总结","text":"","category":"section"},{"location":"man/processing/","page":"标准全息处理","title":"标准全息处理","text":"总的来说，一个开启了多线程的全息图数值重建代码范例（High Performance）如下：","category":"page"},{"location":"man/processing/","page":"标准全息处理","title":"标准全息处理","text":"FFTW.set_num_threads(Sys.CPU_THREADS)\nPr = plan_rfft(holo)\n# scale是手动调整的\nscale = 1500\nre_img = reconst(holo, Pr, scale; nthreads=true)","category":"page"},{"location":"man/processing/","page":"标准全息处理","title":"标准全息处理","text":"如果你坚持要完整的重建像，则范例如下：","category":"page"},{"location":"man/processing/","page":"标准全息处理","title":"标准全息处理","text":"FFTW.set_num_threads(Sys.CPU_THREADS)\nP = plan_fft(holo)\n# scale是手动调整的\nscale = 1500\nre_img = reconst(holo, P, scale; nthreads=true)","category":"page"},{"location":"man/processing/","page":"标准全息处理","title":"标准全息处理","text":"如果你还需要对图像进行旋转（建议仅在需要观测合适的重建像时使用），则范例如下","category":"page"},{"location":"man/processing/","page":"标准全息处理","title":"标准全息处理","text":"FFTW.set_num_threads(Sys.CPU_THREADS)\nP = plan_fft(holo)\n# scale是手动调整的\nscale = 1500\nre_img = reconst(holo, P, scale; shift=true, nthreads=true)","category":"page"},{"location":"man/processing/","page":"标准全息处理","title":"标准全息处理","text":"note: Note\n你可能不确定shift采用true还是false，我建议你都试一下，然后用imshow函数看一下图像的区别。","category":"page"},{"location":"man/function/#函数库","page":"函数库","title":"函数库","text":"","category":"section"},{"location":"man/function/#全息处理","page":"函数库","title":"全息处理","text":"","category":"section"},{"location":"man/function/","page":"函数库","title":"函数库","text":"HoloProcessing.brightness\nHoloProcessing.load_holo\nHoloProcessing.normalize\nHoloProcessing.normalize!\nHoloProcessing.color\nHoloProcessing.reconst","category":"page"},{"location":"man/function/#HoloProcessing.brightness","page":"函数库","title":"HoloProcessing.brightness","text":"brightness(c) -> Float64\n\n对给定的颜色三通道像素值，求出其亮度并以浮点数的形式输出\n\nNotice\n\n由于实验中记录的全息图都是灰度图像，其三个通道分量颜色都是一致的，故取某一颜色分量作为其亮度即可\n\nArguments\n\nc: RGB类型的像素值\n\n\n\n\n\nbrightness(::AbstractMatrix{T}) -> AbstractMatrix{Float64}\n\n对给定的颜色三通道图像，求出其亮度并以浮点数的形式输出\n\nNotice\n\n由于实验中记录的全息图都是灰度图像，其三个通道分量颜色都是一致的，故取某一颜色分量作为其亮度即可\n\n\n\n\n\n","category":"function"},{"location":"man/function/#HoloProcessing.load_holo","page":"函数库","title":"HoloProcessing.load_holo","text":"load_holo(PATH::String, name::String; convert=true) -> AbstractMatrix\n\n给定图像路径以及图像的名称(包括后缀)，实现对全息图的载入\n\nArguments\n\nPATH: 图像所在路径\nname: 图像的名称，比如tail.bmp\nconvert: 可选参数，默认值是true。当为true时，该函数返回图像的灰度值浮点数矩阵；当为false时，该函数直接返回图像\n\n\n\n\n\n","category":"function"},{"location":"man/function/#HoloProcessing.normalize","page":"函数库","title":"HoloProcessing.normalize","text":"normalize(x::AbstractMatrix; nthreads=false) -> AbstractMatrix\n\n对矩阵x进行归一化，并返回归一化后的矩阵\n\nArguments\n\nx: 矩阵\nnthreads: 决定是否开多线程来进行归一化，默认为否\n\nNotice\n\n对于不大的矩阵（低于10000 × 10000），不建议开多线程，这是因为多线程会有额外的内存和时间开销\n\n\n\n\n\n","category":"function"},{"location":"man/function/#HoloProcessing.normalize!","page":"函数库","title":"HoloProcessing.normalize!","text":"normalize!(x::AbstractMatrix; nthreads=false) -> AbstractMatrix\n\n对矩阵x进行原地归一化，即原地修改矩阵并返回修改后的x\n\nArguments\n\nx: 矩阵\nx: 矩阵\nnthreads: 决定是否开多线程来进行归一化，默认为否\n\nNotice\n\n对于不大的矩阵（低于10000 × 10000），不建议开多线程，这是因为多线程会有额外的内存和时间开销\n\n\n\n\n\n","category":"function"},{"location":"man/function/#HoloProcessing.color","page":"函数库","title":"HoloProcessing.color","text":"color(x::AbstractMatrix{<:AbstractFloat}) -> AbstractMatrix\n\n将浮点数类型矩阵转换为灰度图像\n\nArguments\n\nx: 浮点数矩阵\n\n\n\n\n\n","category":"function"},{"location":"man/function/#HoloProcessing.reconst","page":"函数库","title":"HoloProcessing.reconst","text":"reconst(holo::AbstractMatrix, P::FFTW.FFTWPlan, scale::Integer; shift=false) -> AbstractMatrix\n\n对无透镜傅立叶全息图进行数值重建\n\nArguments\n\nholo: 无透镜傅立叶全息图\nP: 其类型为FFTW.FFTWPlan，表示重建采用fft傅立叶变换\nscale: 由于零级像强度过大，故需要用scale拉升±1级像的强度\nshift: 是否旋转图像，默认为否（除非是想展示完整的重建像，否则不建议将shift设为true，因为其内存和时间开销比较大）\nnthreads: 是否开启多线程，默认为是（值得注意的是，该线程与傅立叶变换多线程的开启无关）\n\n\n\n\n\n","category":"function"},{"location":"man/function/#全息降噪","page":"函数库","title":"全息降噪","text":"","category":"section"},{"location":"man/function/","page":"函数库","title":"函数库","text":"HoloProcessing.make_sub_holo!\nHoloProcessing.reconst_tensor!","category":"page"},{"location":"man/function/#HoloProcessing.make_sub_holo!","page":"函数库","title":"HoloProcessing.make_sub_holo!","text":"make_sub_holo!(\n    tensor::AbstractArray{T,3}, \n    holo::AbstractMatrix{T}, \n    windows_size::Tuple{Integer,Integer}, \n    interval::Tuple{Integer,Integer}, \n    nums_of_holo::Tuple{Integer,Integer}\n) -> AbstractArray{T,3} where T <: AbstractFloat\n\n生成子全息图并将其存放到tenosr序列上\n\nArguments\n\ntensor: 子全息图序列\nholo: 原始全息图\nwindows_size: 掩膜窗口的大小\ninterval: 窗口偏移量\nnumsofholo: 子全息图的数量（与tensor的第三个维度一致）\n\nNotice\n\n当子全息图大小与原始全息图一致时，则对位于窗口外的地方补零\n当子全息图大小与掩膜窗口大小一致时，则抛弃窗口外的数据\n\n\n\n\n\n","category":"function"},{"location":"man/function/#HoloProcessing.reconst_tensor!","page":"函数库","title":"HoloProcessing.reconst_tensor!","text":"reconst_tensor!(\n    re_tensor::AbstractArray{T,3}, \n    holo_tensor::AbstractArray{T,3}, \n    P::FFTW.FFTWPlan, \n    scale::Integer; \n    shift = false\n    ) -> AbstractArray{T,3} where T <: AbstractFloat\n\n对子全息图序列进行数值重建并存放到re_tensor\n\nArguments\n\nre_tensor: 子再现像序列\nholo_tensor: 子全息图序列\nP: 其类型为FFTW.FFTWPlan，表示重建采用fft傅立叶变换\nscale: 由于零级像强度过大，故需要用scale拉升±1级像的强度\nshift: 是否旋转图像，默认为否（除非是想展示完整的重建像，否则不建议将shift设为true，因为其内存和时间开销比较大）\n\n\n\n\n\n","category":"function"},{"location":"man/function/#空域掩膜法实现","page":"函数库","title":"空域掩膜法实现","text":"","category":"section"},{"location":"man/function/","page":"函数库","title":"函数库","text":"HoloProcessing.sdm\nHoloProcessing.sdm_core!","category":"page"},{"location":"man/function/#HoloProcessing.sdm","page":"函数库","title":"HoloProcessing.sdm","text":"sdm(     holo::AbstractMatrix{T},      windows_size::Tuple{Integer,Integer},      interval::Tuple{Integer,Integer},      P::FFTW.FFTWPlan,      scale::Integer;      shift = false     ) -> AbstractMatrix where T <: AbstractFloat\n\n空域掩膜法的算法实现，具体可见doi: 10.1109/JDT.2015.2479646\n\nArguments\n\nholo: 全息图（非RGB类型而是AbstractFloat类型）\nwindows_size: 掩膜窗口大小\ninterval: 窗口偏移量\nholo: 原始全息图\nP: 其类型为FFTW.FFTWPlan，表示重建采用fft傅立叶变换\nscale: 由于零级像强度过大，故需要用scale拉升±1级像的强度\nshift: 是否旋转图像，默认为否（除非是想展示完整的重建像，否则不建议将shift设为true，因为其内存和时间开销比较大）\n\n\n\n\n\n","category":"function"},{"location":"man/function/#HoloProcessing.sdm_core!","page":"函数库","title":"HoloProcessing.sdm_core!","text":"sdm_core!(sdm_img::AbstractMatrix{T}, re_tensor::AbstractArray{T,3}) -> AbstractMatrix where T <: AbstractFloat\n\n空域掩膜法的核心算法，对子再现像序列进行叠加平均，并存进sdm_img中\n\nArguments\n\nsdm_img: 存放结果的矩阵\nre_tensor: 子再现像序列\n\n\n\n\n\n","category":"function"},{"location":"man/function/#冗余散斑降噪法实现","page":"函数库","title":"冗余散斑降噪法实现","text":"","category":"section"},{"location":"man/function/","page":"函数库","title":"函数库","text":"HoloProcessing.rse\nHoloProcessing.rse_core!","category":"page"},{"location":"man/function/#HoloProcessing.rse","page":"函数库","title":"HoloProcessing.rse","text":"rse(     holo::AbstractMatrix{T},      windows_size::Tuple{Integer,Integer},      interval::Tuple{Integer,Integer},      P::FFTW.FFTWPlan,      scale::Integer;      shift = false     ) -> AbstractMatrix{T} where T <: AbstractFloat\n\n冗余散斑降噪法的算法实现，具体可见doi: 10.1364/AO.390500\n\nArguments\n\nholo: 全息图（非RGB类型而是AbstractFloat类型）\nwindows_size: 掩膜窗口大小\ninterval: 窗口偏移量\nholo: 原始全息图\nP: 其类型为FFTW.FFTWPlan，表示重建采用fft傅立叶变换\nscale: 由于零级像强度过大，故需要用scale拉升±1级像的强度\nshift: 是否旋转图像，默认为否（除非是想展示完整的重建像，否则不建议将shift设为true，因为其内存和时间开销比较大）\n\n\n\n\n\n","category":"function"},{"location":"man/function/#HoloProcessing.rse_core!","page":"函数库","title":"HoloProcessing.rse_core!","text":"rse_core!(rse_img::AbstractMatrix{T}, re_tensor::AbstractArray{T,3}) -> AbstractMatrix where T <: AbstractFloat\n\n冗余散斑降噪法的核心算法，对子再现像序列进行去冗余而后叠加平均，并存进rse_img中\n\nArguments\n\nrse_img: 存放结果的矩阵\nre_tensor: 子再现像序列\n\n\n\n\n\n","category":"function"},{"location":"man/function/#低维重建法实现","page":"函数库","title":"低维重建法实现","text":"","category":"section"},{"location":"man/function/","page":"函数库","title":"函数库","text":"HoloProcessing.ldr\nHoloProcessing.ldr_core!\nHoloProcessing.ldr_denoising!\nHoloProcessing.ldr_aggregation!","category":"page"},{"location":"man/function/#HoloProcessing.ldr","page":"函数库","title":"HoloProcessing.ldr","text":"ldr(\n    holo::AbstractMatrix{T}, \n    N::Integer, \n    interval::Tuple{Integer,Integer}, \n    P::FFTW.FFTWPlan, \n    scale::Integer; \n    shift = false\n    ) -> AbstractMatrix{T} where T <: AbstractFloat\n\n低维度重建法的算法实现，具体可见doi: 10.1364/AO.414773\n\nArguments\n\nholo: 全息图\nN: 窗口大小的N倍就等于holo的大小\ninterval: 窗口偏移量\nholo: 原始全息图\nP: 其类型为FFTW.FFTWPlan，表示重建采用fft傅立叶变换\nscale: 由于零级像强度过大，故需要用scale拉升±1级像的强度\nshift: 是否旋转图像，默认为否（除非是想展示完整的重建像，否则不建议将shift设为true，因为其内存和时间开销比较大）\n\n\n\n\n\n","category":"function"},{"location":"man/function/#HoloProcessing.ldr_core!","page":"函数库","title":"HoloProcessing.ldr_core!","text":"ldr_core!(ldr_img::AbstractMatrix{T}, re_tensor::AbstractArray{T,3}, N::Integer) -> AbstractMatrix where T <: AbstractFloat\n\n低维重建法的核心降噪算法，对子再现像序列进行分组平均、聚合、再经过均值滤波器，最后结果存进ldr_img中\n\nArguments\n\nldr_img: 存放结果的矩阵\nre_tensor: 子再现像序列\nN: 分成N组\n\n\n\n\n\n","category":"function"},{"location":"man/function/#HoloProcessing.ldr_denoising!","page":"函数库","title":"HoloProcessing.ldr_denoising!","text":"ldr_denoising!(mean_tensor::AbstractArray{T, 3}, re_tensor::AbstractArray{T,3}, N::Integer) -> AbstractArray{T, 3} where T <: AbstractFloat\n\n低维重建法的核心降噪算法中的降噪步骤，对子再现像序列re_tensor进行分组平均，其结果放到mean_tensor中\n\nArguments\n\nmean_tensor: 存放结果的矩阵\nre_tensor: 子再现像序列\nN: 分成N组\n\n\n\n\n\n","category":"function"},{"location":"man/function/#HoloProcessing.ldr_aggregation!","page":"函数库","title":"HoloProcessing.ldr_aggregation!","text":"ldr_aggregation!(ldr_img::AbstractArray{T, 3}, mean_tensor::AbstractArray{T,3}, N::Integer) -> AbstractMatrix where T <: AbstractFloat\n\n低维重建法的核心降噪算法中的聚合步骤，将低维再现像聚合成高维再现像\n\nArguments\n\nldr_img: 存放结果的矩阵\nmean_tensor: 低维再现像序列\nN: 分成N组\n\n\n\n\n\n","category":"function"},{"location":"man/function/#评价方法","page":"函数库","title":"评价方法","text":"","category":"section"},{"location":"man/function/","page":"函数库","title":"函数库","text":"HoloProcessing.contrast\nHoloProcessing.ssi\nHoloProcessing.smpi\nHoloProcessing.enl","category":"page"},{"location":"man/function/#HoloProcessing.contrast","page":"函数库","title":"HoloProcessing.contrast","text":"contrast(img::AbstractMatrix) -> AbstractFloat\n\n计算图像img的对比度\n\n\n\n\n\n","category":"function"},{"location":"man/function/#HoloProcessing.ssi","page":"函数库","title":"HoloProcessing.ssi","text":"ssi(; noised::AbstractMatrix{T}, filtered::AbstractMatrix{T})) -> AbstractFloat  where T\n\n计算图像img的SSI值\n\nArguments\n\nnoised: 噪声图像\nfiltered: 降噪后的图像\n\n\n\n\n\n","category":"function"},{"location":"man/function/#HoloProcessing.smpi","page":"函数库","title":"HoloProcessing.smpi","text":"smpi(; noised::AbstractMatrix{T}, filtered::AbstractMatrix{T})) -> AbstractFloat  where T\n\n计算图像img的SMPI值\n\nArguments\n\nnoised: 噪声图像\nfiltered: 降噪后的图像\n\n\n\n\n\n","category":"function"},{"location":"man/function/#HoloProcessing.enl","page":"函数库","title":"HoloProcessing.enl","text":"enl(img::AbstractMatrix) -> AbstractFloat\n\n计算图像img的ENL值\n\n\n\n\n\n","category":"function"},{"location":"#HoloProcessing.jl","page":"主页","title":"HoloProcessing.jl","text":"","category":"section"},{"location":"#Package-Features","page":"主页","title":"Package Features","text":"","category":"section"},{"location":"","page":"主页","title":"主页","text":"该包主要分三大模块：","category":"page"},{"location":"","page":"主页","title":"主页","text":"标准全息处理：\n全息的读取\n全息的重建（仅实现无透镜傅立叶变换全息的数值重建）\n全息降噪算法\n空域掩膜法（SDM）\n冗余散斑降噪法（RSE）\n低维重建法（LDR）\n质量评价指标\nContrast\nENL\nSMPI\nSSI","category":"page"},{"location":"#Manual-Outline","page":"主页","title":"Manual Outline","text":"","category":"section"},{"location":"","page":"主页","title":"主页","text":"Pages = [\n    \"man/processing.md\",\n    \"man/denoising.md\",\n    \"man/evaluating.md\",\n]\nDepth = 1","category":"page"},{"location":"man/denoising/#全息降噪算法","page":"降噪算法","title":"全息降噪算法","text":"","category":"section"},{"location":"man/denoising/#空域掩膜法（SDM）","page":"降噪算法","title":"空域掩膜法（SDM）","text":"","category":"section"},{"location":"man/denoising/","page":"降噪算法","title":"降噪算法","text":"一个简单的演示案例如下：","category":"page"},{"location":"man/denoising/","page":"降噪算法","title":"降噪算法","text":"holo = load_holo(path, \"xxx.bmp\"; convert=true)\nFFTW.set_num_threads(Sys.CPU_THREADS)\nP = plan_rfft(holo)\t# or P = plan_fft(holo)\n# Parameter\nN = 2\nNx, Ny = size(holo) .÷ N\nDx, Dy = 50, 100\nscale = 600\n\nsdm_img = sdm(holo, (Nx, Ny), (Dx, Dy), P, scale)","category":"page"},{"location":"man/denoising/","page":"降噪算法","title":"降噪算法","text":"note: Note\n更多的用法，可以通过输入如下：>julia?\nhelp>sdm来获取sdm函数的更多用法．","category":"page"},{"location":"man/denoising/#冗余散斑降噪法（RSE）","page":"降噪算法","title":"冗余散斑降噪法（RSE）","text":"","category":"section"},{"location":"man/denoising/","page":"降噪算法","title":"降噪算法","text":"一个简单的演示案例如下：","category":"page"},{"location":"man/denoising/","page":"降噪算法","title":"降噪算法","text":"holo = load_holo(path, \"xxx.bmp\"; convert=true)\nFFTW.set_num_threads(Sys.CPU_THREADS)\nP = plan_rfft(holo)\t# or P = plan_fft(holo)\n# Parameter\nN = 2\nNx, Ny = size(holo) .÷ N\nDx, Dy = 50, 100\nscale = 600\n\nsdm_img = rse(holo, (Nx, Ny), (Dx, Dy), P, scale)","category":"page"},{"location":"man/denoising/","page":"降噪算法","title":"降噪算法","text":"note: Note\n更多的用法，可以通过输入如下：>julia?\nhelp>rse来获取rse函数的更多用法．","category":"page"},{"location":"man/denoising/#低维重建法（LDR）","page":"降噪算法","title":"低维重建法（LDR）","text":"","category":"section"},{"location":"man/denoising/","page":"降噪算法","title":"降噪算法","text":"一个简单的演示案例如下：","category":"page"},{"location":"man/denoising/","page":"降噪算法","title":"降噪算法","text":"holo = load_holo(path, \"xxx.bmp\"; convert=true)\nFFTW.set_num_threads(Sys.CPU_THREADS)\n\n# Parameter\nN = 2\nP = plan_rfft(similar(holo, size(holo) .÷ N))\n# or P = plan_fft(similar(holo, size(holo) .÷ N))\n\nDx, Dy = 50, 100\nscale = 600\n\nldr_img = ldr(holo, N, (Dx, Dy), P, scale)","category":"page"},{"location":"man/denoising/","page":"降噪算法","title":"降噪算法","text":"note: Note\n更多的用法，可以通过输入如下：>julia?\nhelp>ldr来获取ldr函数的更多用法．","category":"page"}]
}

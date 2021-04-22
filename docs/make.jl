using Documenter, HoloProcessing

format = Documenter.HTML(prettyurls=get(ENV, "CI", nothing) == "true")
makedocs(format = format,
    sitename="HoloProcessing",
    pages = [
            "主页" => "index.md",
            "手册" => [
                "标准全息处理" => "man/processing.md",
                "降噪算法" => "man/denoising.md",
                "评价指标" => "man/evaluating.md",
                "函数库" => "man/function.md"]
    ]
)

deploydocs(repo = "github.com/rfhklwt/HoloProcessing.jl.git")

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

# using Documenter, DocumenterLaTeX, HoloProcessing
# include("../contrib/LaTeXWriter.jl")

# const PAGES = [
#     "主页" => "index.md",
#     "手册" => [
#         "标准全息处理" => "man/processing.md",
#         "降噪算法" => "man/denoising.md",
#         "评价指标" => "man/evaluating.md",
#         "函数库" => "man/function.md"],
# ]

# const render_pdf = "pdf" in ARGS

# const format = if render_pdf
#     LaTeX(platform = "texplatform=docker" in ARGS ? "docker" : "native")
# else
#     Documenter.HTML(prettyurls=get(ENV, "CI", nothing) == "true")
# end


# makedocs(
#     format    = format,
#     sitename  = "HoloProcessing中文文档",
#     authors   = "Qling",
#     pages     = PAGES,
# )

# deploydocs(repo = "github.com/rfhklwt/HoloProcessing.jl.git")


# using Documenter, HoloProcessing

# format = Documenter.HTML(prettyurls=get(ENV, "CI", nothing) == "true")
# makedocs(format = format,
#     sitename="HoloProcessing",
#     pages = [
#             "主页" => "index.md",
#             "手册" => [
#                 "标准全息处理" => "man/processing.md",
#                 "降噪算法" => "man/denoising.md",
#                 "评价指标" => "man/evaluating.md",
#                 "函数库" => "man/function.md"]
#     ]
# )

# deploydocs(repo = "github.com/rfhklwt/HoloProcessing.jl.git")

# tweaked from https://github.com/JuliaCN/JuliaZH.jl/tree/master/doc/make.jl
# Install dependencies needed to build the documentation.
using Pkg
Pkg.instantiate()

using Documenter, DocumenterLaTeX

const PAGES = [
    "主页" => "index.md",
    "手册" => [
        "标准全息处理" => "man/processing.md",
        "降噪算法" => "man/denoising.md",
        "评价指标" => "man/evaluating.md",
        "函数库" => "man/function.md"]
]

const render_pdf = "pdf" in ARGS
const is_deploy = "deploy" in ARGS

const format = if render_pdf
    LaTeX(platform = "texplatform=docker" in ARGS ? "docker" : "native")
else
    Documenter.HTML(
        prettyurls = is_deploy,
        canonical = is_deploy ? "https://rfhklwt.github.io/HoloProcessing.jl/latest/" : nothing,
        analytics = "UA-28835595-9",
        lang = "zh-cn",
    )
end

makedocs(
    clean     = true,
    doctest   = ("doctest=fix" in ARGS) ? (:fix) : ("doctest=true" in ARGS) ? true : false,
    linkcheck = "linkcheck=true" in ARGS,
    checkdocs = :none,
    format    = format,
    sitename  = "HoloProcessing中文文档",
    authors   = "Qling",
    pages     = PAGES,
)

deploydocs(
    repo = "github.com/rfhklwt/HoloProcessing.jl.git",
    target = "build",
    deps = nothing,
    make = nothing,
    branch = render_pdf ? "pdf" : "gh-pages"
)

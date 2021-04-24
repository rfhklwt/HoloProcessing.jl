using Documenter, HoloProcessing
include("../contrib/LaTeXWriter.jl")

const PAGES = [
    "主页" => "index.md",
    "手册" => [
        "manual/processing.md",
        "manual/denoising.md",
        "manual/evaluating.md",
        "manual/function.md",
    ],
]

const render_pdf = "pdf" in ARGS

const format = if render_pdf
    Documenter.LaTeX(platform = "texplatform=docker" in ARGS ? "docker" : "native")
else
    Documenter.HTML(prettyurls=get(ENV, "CI", nothing) == "true")
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
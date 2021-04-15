module HoloProcessing

using Images
using FFTW
using Pipe
using Random
using Statistics

export brightness, load_holo, normalize, normalize!, color, reconst
export sdm, rse, ldr
export contrast, ssi, smpi, enl

include("holo_processing.jl")
include("holo_denoising.jl")
include("holo_evaluating.jl")

end

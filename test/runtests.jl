using HoloProcessing
using Test
using FFTW
using BenchmarkTools
using LinearAlgebra: norm


@testset "HoloProcessing.jl" begin
    img = [
        16.0 2 3 13
        5 11 10 8
        9 7 6 12
        4 14 15 1
    ]

    @test reconst(img, plan_rfft(img), 1) |> norm ==
          reconst(img, plan_rfft(img), 1; nthreads = true) |> norm ≈
          1.1215103508786834
    @test reconst(img, plan_fft(img), 1) |> norm ==
          reconst(img, plan_fft(img), 1; nthreads = true) |> norm ≈
          1.1375929179890423
    @test reconst(img, plan_fft(img), 1; shift = true) |> norm ==
          reconst(img, plan_fft(img), 1; shift = true, nthreads = true) |> norm ≈
          1.137592917989042
    @test normalize(img) == normalize!(img)
    @test img |> color .|> Float64 == img
    # path = "/home/qling/Documents/Denoising/hologram"
    # holo = load_holo(path, "head.bmp")
    # FFTW.set_num_threads(Sys.CPU_THREADS)
    # P1 = plan_rfft(holo)
    # @benchmark sdm($holo, $(size(holo) .÷ 2), ($50, $100), $P1, $600)

    # @benchmark rse($holo, $(size(holo) .÷ 2), ($50, $100), $P1, $600)

    # P2 = plan_rfft(similar(holo, size(holo) .÷ 2))

    # @benchmark ldr($holo, $2, ($50, $100), $P2, $600)
end
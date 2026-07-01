cmake_minimum_required(VERSION 3.22.1)

project(generic_engine_jni)

set(CORE_ENGINE_DIR "${CMAKE_CURRENT_SOURCE_DIR}/../../../../core-engine")

add_library(
    generic_engine_jni
    SHARED
    native_engine_jni.cpp
    "${CORE_ENGINE_DIR}/src/engine.cpp"
    "${CORE_ENGINE_DIR}/src/algorithm/score_algorithm.cpp"
)

target_include_directories(
    generic_engine_jni
    PRIVATE
    "${CORE_ENGINE_DIR}/include"
    "${CORE_ENGINE_DIR}/src/algorithm"
)

find_library(log-lib log)

target_link_libraries(
    generic_engine_jni
    ${log-lib}
)


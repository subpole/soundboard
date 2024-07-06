import os
from pydub import AudioSegment
import numpy as np

def get_rms(audio_segment):
    """Calculate the Root Mean Square (RMS) of an audio segment."""
    samples = np.array(audio_segment.get_array_of_samples())
    return np.sqrt(np.mean(samples**2))

def normalize_volume(input_folder, output_folder, target_dBFS=-20.0, quieter_dB=-25.0):
    """Normalize the volume of all audio files in the specified input folder and save them to the output folder, preserving the directory structure."""
    # Ensure the target dBFS is negative
    target_dBFS = -abs(target_dBFS)
    
    # Ensure the output folder exists
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    # Walk through the input folder
    for root, dirs, files in os.walk(input_folder):
        # Calculate the relative path from the input folder to the current directory
        relative_path = os.path.relpath(root, input_folder)
        
        # Create the corresponding directory in the output folder
        output_dir = os.path.join(output_folder, relative_path)
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)
        
        # Iterate over all files in the current directory
        for filename in files:
            if filename.endswith((".mp3", ".wav", ".flac", ".ogg")):
                input_file_path = os.path.join(root, filename)
                audio = AudioSegment.from_file(input_file_path)

                # Calculate current dBFS
                current_dBFS = audio.dBFS

                # Calculate the difference in dBFS
                change_in_dBFS = target_dBFS - current_dBFS

                # Adjust volume to normalize
                normalized_audio = audio.apply_gain(change_in_dBFS)
                
                # Further reduce the volume by the specified amount (50% quieter)
                quieter_audio = normalized_audio.apply_gain(quieter_dB)

                # Determine the file extension and format
                file_extension = filename.split('.')[-1]

                # Export the normalized and quieter audio to the output directory
                output_file_path = os.path.join(output_dir, filename)
                quieter_audio.export(output_file_path, format=file_extension)

                print(f"Normalized {filename} in {relative_path}, change: {change_in_dBFS + quieter_dB:.2f} dBFS")

if __name__ == "__main__":
    input_folder = "./_audios" #Replace with your input folder path
    output_folder = "./audios"  # Replace with your output folder path
    normalize_volume(input_folder, output_folder)

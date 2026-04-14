import qrcode
import os

output_dir = "android/app/src/scripts/output_qrs"

# Diccionario para los qr
data = {
    "01-ingreso": "INGRESO",
    "02-mesa-01": "MESA_01",
    "03-mesa-02": "MESA_02",
    "04-propina-10": "PROPINA_10"
}

for nombre, contenido in data.items():
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(contenido)
    qr.make(fit=True)
    
    img = qr.make_image(fill_color="#121737", back_color="#e6eceb")
    
    file_name = f"{nombre}.png"
    file_path = os.path.join(output_dir, file_name)
    
    try:
        img.save(file_path)
        print(f"{file_name} guardado con éxito.")
    except FileNotFoundError:
        print(f"Error: No se pudo guardar {file_name}. Verifica que la ruta '{output_dir}' sea accesible.")

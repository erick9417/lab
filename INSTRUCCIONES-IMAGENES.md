# Instrucciones para Agregar Imágenes de Cuñas y Alzas

```powershell
# Copiar imágenes PNG desde tu carpeta de Descargas al proyecto
Copy-Item "C:\Users\Angie\Downloads\Diseños\Arco Transverso (AT).png" -Destination "C:\Users\Angie\Documents\Sistemas\Lab\lucvan-sistema\public\images\cunas\arco-transverso.png"
Copy-Item "C:\Users\Angie\Downloads\Diseños\Barra metatarsal (BTM).png" -Destination "C:\Users\Angie\Documents\Sistemas\Lab\lucvan-sistema\public\images\cunas\barra-metatarsal.png"
Copy-Item "C:\Users\Angie\Downloads\Diseños\Cuña calcánea interna (CCI).png" -Destination "C:\Users\Angie\Documents\Sistemas\Lab\lucvan-sistema\public\images\cunas\cuna-calcanea-interna.png"
Copy-Item "C:\Users\Angie\Downloads\Diseños\Cuña calcánea extrena (CCE).png" -Destination "C:\Users\Angie\Documents\Sistemas\Lab\lucvan-sistema\public\images\cunas\cuna-calcanea-extrema.png"
Copy-Item "C:\Users\Angie\Downloads\Diseños\Cuña calcánea Larga extrena (Antepie).png" -Destination "C:\Users\Angie\Documents\Sistemas\Lab\lucvan-sistema\public\images\cunas\cuna-calcanea-larga.png"
Copy-Item "C:\Users\Angie\Downloads\Diseños\Elevación A.L..png" -Destination "C:\Users\Angie\Documents\Sistemas\Lab\lucvan-sistema\public\images\cunas\elevacion-al.png"
Copy-Item "C:\Users\Angie\Downloads\Diseños\Alza.png" -Destination "C:\Users\Angie\Documents\Sistemas\Lab\lucvan-sistema\public\images\cunas\Alza.png"
```

## 📁 Ubicación de las imágenes

Las imágenes de referencia se encuentran en:
```
C:\Users\Angie\Downloads\Diseños
```

## 🎯 Destino en el proyecto

Las imágenes deben copiarse a:
```
lucvan-sistema/public/images/cunas/
```

## 🖼️ Imágenes necesarias (PNG)

Debes copiar las siguientes imágenes en formato PNG con los nombres exactos:

1. **arco-transverso.png** - Imagen de referencia para Arco Transverso (AT)
2. **barra-metatarsal.png** - Imagen de referencia para Barra Metatarsal (BTM)
3. **cuna-calcanea-interna.png** - Imagen de referencia para Cuña Calcánea Interna (CCI)
4. **cuna-calcanea-extrema.png** - Imagen de referencia para Cuña Calcánea Extrema (CCE)
5. **cuna-calcanea-larga.png** - Imagen de referencia para Cuña Calcánea Larga
6. **elevacion-al.png** - Imagen de referencia para Elevación A.L.
7. **Alza.png** - Imagen de referencia para Alza

## 🔧 Cómo convertir a WebP

### Opción 1: Online (Más fácil)
1. Visita: https://cloudconvert.com/jpg-to-webp
2. Sube cada imagen
3. Convierte a WebP
4. Descarga y renombra según la lista de arriba

### Opción 2: PowerShell (copiar directamente PNG)
```powershell
# Copiar todas las imágenes necesarias
# (Puedes usar el bloque al inicio de este documento)
```

### Opción 3: Herramienta online más simple
https://convertio.co/es/jpg-webp/

## 📏 Especificaciones de las imágenes

- **Tamaño**: Las imágenes se mostrarán pequeñas (48x48 px) - solo de referencia
- **Calidad**: 70-80% es suficiente para mantener peso bajo
- **Formato**: PNG (ya integrado en el sistema)

## ✅ Verificación

Después de copiar las imágenes, verifica que estén en:
```
lucvan-sistema/
└── public/
    └── images/
        └── cunas/
            ├── arco-transverso.png
            ├── barra-metatarsal.png
            ├── cuna-calcanea-interna.png
            ├── cuna-calcanea-extrema.png
            ├── cuna-calcanea-larga.png
            ├── elevacion-al.png
            └── Alza.png
```

## 🚀 Después de copiar las imágenes

1. Ejecuta `npm run build` para reconstruir el proyecto
2. Las imágenes aparecerán automáticamente en el formulario
3. Si falta alguna imagen, no mostrará error (tiene fallback invisible)

---

**Nota**: Las imágenes son opcionales. Si no se encuentran, el formulario seguirá funcionando normalmente.

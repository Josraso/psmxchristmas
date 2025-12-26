# 🎄 PSMX Christmas - Módulo de Decoraciones Navideñas

Sistema profesional de decoraciones navideñas para PrestaShop con configuración completa y múltiples efectos.

## ✨ Características

### 💡 Luces Navideñas
- **Cable visible**: Las luces cuelgan de un cable realista fijado en la parte superior
- **Múltiples colores**: Rojo, verde, amarillo, azul, magenta y cian
- **Efecto de parpadeo**: Animación suave y realista
- **Cantidad configurable**: De 10 a 50 luces
- **Diseño mejorado**: Con base metálica, brillo y sombras realistas
- **Posicionamiento fijo**: Siempre visible en la parte superior de la página

### ❄️ Sistema de Nieve
- **3 tipos de copos**:
  - **Clásica**: Copos redondos tradicionales
  - **Estrellas**: Copos en forma de estrella de 6 puntas
  - **Mixta**: Combinación de ambos tipos
- **Controles avanzados**:
  - Cantidad: 10-150 copos
  - Velocidad: 0.5x a 3x
  - Tamaño: Pequeño, Mediano, Grande
  - Opacidad configurable
- **Animación fluida**: Movimiento natural con física realista

### ⭐ Estrellas Brillantes
- Efecto de centelleo suave
- Distribución aleatoria en la parte superior
- Cantidad configurable (5-50 estrellas)
- Tamaños variables para efecto realista

### 🎊 Confeti Navideño
- Partículas de colores navideños
- Rotación 3D mientras caen
- Cantidad configurable (10-100 piezas)
- Colores personalizables

## 🎮 Panel de Control

### Acceso
- Botón flotante con icono de árbol de navidad (🎄)
- Ubicado en la esquina inferior derecha
- Animación de pulsación para llamar la atención

### Configuración Disponible

Cada elemento tiene su propio interruptor de activación/desactivación y controles específicos:

#### Luces
- ✅ Activar/Desactivar
- 🔢 Cantidad de luces
- 🔌 Mostrar/Ocultar cable

#### Nieve
- ✅ Activar/Desactivar
- 🎨 Tipo de copo (Clásica/Estrellas/Mixta)
- 🔢 Cantidad de copos
- ⚡ Velocidad de caída
- 📏 Tamaño de copos

#### Estrellas
- ✅ Activar/Desactivar
- 🔢 Cantidad de estrellas

#### Confeti
- ✅ Activar/Desactivar
- 🔢 Cantidad de piezas

### Persistencia
La configuración se guarda automáticamente en `localStorage` del navegador, por lo que las preferencias del usuario se mantienen entre sesiones.

## 🚀 Instalación

1. Copia el módulo a la carpeta `modules/psmxchristmas/` de tu PrestaShop
2. Ve al Back Office > Módulos > Catálogo de módulos
3. Busca "Luces Navideñas"
4. Haz clic en "Instalar"

## 📁 Estructura de Archivos

```
psmxchristmas/
├── psxmchristmas.php          # Archivo principal del módulo
├── README.md                  # Esta documentación
└── views/
    ├── css/
    │   └── christmas.css      # Estilos completos
    └── js/
        └── christmas.js       # Lógica y animaciones
```

## 🎨 Personalización Avanzada

### Modificar Colores de Luces
En `christmas.js`, línea 14:
```javascript
colors: ['#ff0000', '#00ff00', '#ffff00', '#0000ff', '#ff00ff', '#00ffff']
```

### Modificar Colores de Confeti
En `christmas.js`, línea 34:
```javascript
colors: ['#ff0000', '#00ff00', '#ffff00', '#0000ff', '#ff00ff']
```

### Ajustar Z-Index
Las decoraciones usan los siguientes z-index:
- Panel de control: 10000
- Luces: 9999
- Nieve: 9998
- Estrellas: 9997
- Confeti: 9996

## 📱 Responsive

El módulo está completamente optimizado para:
- 💻 Desktop
- 📱 Tablets
- 📱 Móviles

### Breakpoints
- Tablet: 768px
- Móvil: 480px

## ♿ Accesibilidad

- **Modo reducción de movimiento**: Respeta `prefers-reduced-motion`
- **Modo oscuro**: Adapta el panel de control automáticamente
- **Sin interferencia**: `pointer-events: none` en decoraciones
- **Alto contraste**: Textos legibles y colores bien diferenciados

## 🔧 Tecnologías Utilizadas

- JavaScript Vanilla (ES6+)
- Canvas API para nieve y confeti
- CSS3 con animaciones y gradientes
- LocalStorage para persistencia
- RequestAnimationFrame para rendimiento óptimo

## 📊 Rendimiento

- Animaciones optimizadas con `requestAnimationFrame`
- Limpieza automática de recursos al cambiar configuración
- Responsive sin recálculos innecesarios
- Bajo consumo de memoria

## 🐛 Solución de Problemas

### Las decoraciones no aparecen
1. Verifica que el módulo esté instalado y activo
2. Limpia la caché de PrestaShop
3. Verifica la consola del navegador en busca de errores

### El panel no se abre
1. Verifica que JavaScript esté habilitado
2. Comprueba que no haya conflictos con otros scripts
3. Revisa la consola para errores

### Bajo rendimiento
1. Reduce la cantidad de elementos en el panel
2. Reduce la velocidad de la nieve
3. Desactiva elementos que no necesites

## 📝 Notas de Versión

### v2.0.0 (Actual)
- ✨ Panel de configuración completo
- 💡 Luces mejoradas con cable visible
- ❄️ Sistema de nieve configurable con 3 tipos
- ⭐ Estrellas brillantes
- 🎊 Confeti navideño
- 💾 Persistencia de configuración
- 📱 Diseño responsive
- ♿ Mejoras de accesibilidad

### v1.0.0
- Versión básica con luces y nieve simple

## 📄 Licencia

Este módulo es de código abierto y puede ser modificado según tus necesidades.

## 👨‍💻 Soporte

Para reportar problemas o sugerencias, contacta con el equipo de desarrollo.

---

**¡Felices fiestas!** 🎄🎅⛄

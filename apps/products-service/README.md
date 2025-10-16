# Products Service - Microservicio de Productos de Seguros

Microservicio para la gestión de productos de seguros, compañías aseguradoras y tipos de seguros en el sistema CRM de Austral Seguros.

## 🏗️ Arquitectura

Este microservicio gestiona tres entidades principales:

### 1. **Tipos de Seguros** (`tipo_seguro`)
Categorización de los diferentes tipos de seguros disponibles.

**Campos principales:**
- `idTipoSeguro`: Identificador único (UUID)
- `nombre`: Nombre del tipo de seguro
- `descripcion`: Descripción detallada
- `categoria`: Categoría del seguro
- `requiereInspeccion`: Indica si requiere inspección previa
- `duracionMinimaMeses`: Duración mínima del seguro
- `duracionMaximaMeses`: Duración máxima del seguro
- `estaActivo`: Estado del registro

### 2. **Compañías de Seguros** (`compania_seguro`)
Información de las compañías aseguradoras que ofrecen productos.

**Campos principales:**
- `idCompania`: Identificador único (UUID)
- `nombre`: Nombre comercial
- `razonSocial`: Razón social de la compañía
- `ruc`: RUC único de la compañía
- `direccion`, `telefono`, `email`: Datos de contacto
- `sitioWeb`: URL del sitio web
- `contactoPrincipal`: Persona de contacto
- `telefonoContacto`, `emailContacto`: Datos del contacto
- `estaActivo`: Estado del registro

### 3. **Productos de Seguros** (`producto_seguro`)
Productos específicos ofrecidos por las compañías.

**Campos principales:**
- `idProducto`: Identificador único (UUID)
- `nombre`: Nombre del producto
- `descripcion`: Descripción del producto
- `codigoProducto`: Código interno del producto
- `primaBase`, `primaMinima`, `primaMaxima`: Rangos de prima
- `porcentajeComision`: Comisión aplicable
- `coberturaMaxima`: Cobertura máxima del producto
- `deducible`: Deducible del producto
- `edadMinima`, `edadMaxima`: Rangos de edad permitidos
- `condicionesEspeciales`: Condiciones especiales del producto
- `idCompania`: Relación con compañía de seguros
- `idTipoSeguro`: Relación con tipo de seguro
- `estaActivo`: Estado del registro

## 📡 Endpoints API

### Tipos de Seguros
- `GET /tipos-seguros` - Listar todos los tipos de seguros
- `GET /tipos-seguros?categoria=Automotriz` - Filtrar por categoría
- `GET /tipos-seguros/:id` - Obtener un tipo de seguro específico
- `POST /tipos-seguros` - Crear un nuevo tipo de seguro
- `PATCH /tipos-seguros/:id` - Actualizar un tipo de seguro
- `DELETE /tipos-seguros/:id` - Desactivar un tipo de seguro

### Compañías de Seguros
- `GET /companias-seguro` - Listar todas las compañías
- `GET /companias-seguro/:id` - Obtener una compañía específica
- `POST /companias-seguro` - Crear una nueva compañía
- `PATCH /companias-seguro/:id` - Actualizar una compañía
- `DELETE /companias-seguro/:id` - Desactivar una compañía

### Productos de Seguros
- `GET /productos-seguro` - Listar todos los productos
- `GET /productos-seguro?idCompania=uuid` - Filtrar por compañía
- `GET /productos-seguro?idTipoSeguro=uuid` - Filtrar por tipo de seguro
- `GET /productos-seguro/:id` - Obtener un producto específico
- `POST /productos-seguro` - Crear un nuevo producto
- `PATCH /productos-seguro/:id` - Actualizar un producto
- `DELETE /productos-seguro/:id` - Desactivar un producto

## 🚀 Ejecución

### Desarrollo
```bash
npm run start:dev products-service
```

### Producción
```bash
npm run build products-service
npm run start:prod products-service
```

## 🔧 Configuración

El servicio utiliza las siguientes variables de entorno:

```env
# Base de datos
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=tu_password
DB_NAME=austral_seguros

# Servidor
PORT=3004
NODE_ENV=development
```

## 📚 Documentación Swagger

Una vez iniciado el servicio, la documentación interactiva de Swagger está disponible en:

```
http://localhost:3004/api
```

## 🔐 Validaciones

Todas las entidades incluyen validaciones automáticas mediante `class-validator`:

### Tipos de Seguros
- El nombre es obligatorio y único
- Las duraciones deben ser valores positivos
- La duración mínima no puede ser mayor que la máxima

### Compañías de Seguros
- El nombre es obligatorio
- El RUC debe ser único y contener solo números
- Los emails deben tener formato válido

### Productos de Seguros
- El nombre es obligatorio
- Debe existir la compañía y el tipo de seguro relacionados
- La prima mínima no puede ser mayor que la máxima
- La edad mínima no puede ser mayor que la máxima
- El porcentaje de comisión debe estar entre 0 y 100

## 🗄️ Base de Datos

El servicio utiliza **TypeORM** con PostgreSQL. Todas las entidades utilizan **soft delete** (desactivación lógica) en lugar de eliminación física.

### Convenciones
- Los campos en la base de datos usan `snake_case`
- Las propiedades en las entidades TypeScript usan `camelCase`
- Las primary keys son UUIDs generadas automáticamente
- Todas las tablas tienen el campo `fecha_creacion` con timestamp automático

## 🔄 Relaciones

```
CompaniaSeguro (1) -----> (N) ProductoSeguro
TipoSeguro (1) -----> (N) ProductoSeguro
```

Los productos de seguros están relacionados tanto con una compañía como con un tipo de seguro específico.

## 📝 Notas Importantes

1. **No usar synchronize**: La configuración de TypeORM tiene `synchronize: false` para evitar modificaciones automáticas en la base de datos existente.

2. **Soft Delete**: Todas las eliminaciones son lógicas, marcando `estaActivo = false`.

3. **Validaciones de negocio**: Los servicios incluyen validaciones adicionales más allá de las restricciones de base de datos.

4. **CORS**: El servicio está configurado para aceptar peticiones desde localhost:3000 y localhost:3001.

## 🧪 Testing

Para ejecutar los tests:

```bash
# Tests unitarios
npm run test products-service

# Tests e2e
npm run test:e2e products-service

# Coverage
npm run test:cov products-service
```

import { Injectable, BadRequestException } from '@nestjs/common';
import {
  CalcularCotizacionAutoDto,
  CalcularCotizacionSaludDto,
  CalcularCotizacionSctrDto,
  CotizacionResultDto,
} from '../dto/cotizaciones.dto';

interface VehiculoData {
  marca: string;
  modelo: string;
  anio: number;
  precio_base: number;
  tasa_base: number;
}

interface PlanSaludData {
  nombre: string;
  tipo: 'basico' | 'intermedio' | 'premium' | 'internacional';
  precio_base_mensual: number;
  deducible_anual: number;
  coaseguro: number;
  cobertura_maxima: number;
  descripcion: string;
  coberturas_incluidas: string[];
}

interface RangoEdadSalud {
  edad_min: number;
  edad_max: number;
  factor_edad: number;
}

interface ActividadSctrData {
  codigo: string;
  descripcion: string;
  tasa: number;
}

@Injectable()
export class CotizacionesService {
  // Data ficticia de planes de salud
  private planesSaludData: PlanSaludData[] = [
    {
      nombre: 'Plan Básico',
      tipo: 'basico',
      precio_base_mensual: 45,
      deducible_anual: 500,
      coaseguro: 20,
      cobertura_maxima: 50000,
      descripcion: 'Cobertura básica para consultas y medicamentos',
      coberturas_incluidas: [
        'Consultas médicas generales',
        'Medicamentos ambulatorios',
        'Exámenes de laboratorio básicos',
        'Urgencias',
        'Prevención',
      ],
    },
    {
      nombre: 'Plan Intermedio',
      tipo: 'intermedio',
      precio_base_mensual: 85,
      deducible_anual: 300,
      coaseguro: 15,
      cobertura_maxima: 100000,
      descripcion: 'Cobertura intermedia con hospitalización',
      coberturas_incluidas: [
        'Consultas médicas generales',
        'Medicamentos ambulatorios',
        'Exámenes de laboratorio',
        'Hospitalización',
        'Cirugías ambulatorias',
        'Urgencias 24/7',
        'Prevención',
        'Odontología básica',
      ],
    },
    {
      nombre: 'Plan Premium',
      tipo: 'premium',
      precio_base_mensual: 150,
      deducible_anual: 200,
      coaseguro: 10,
      cobertura_maxima: 200000,
      descripcion: 'Cobertura completa con especialidades',
      coberturas_incluidas: [
        'Consultas médicas generales y especializadas',
        'Medicamentos ambulatorios e intrahospitalarios',
        'Exámenes de laboratorio y diagnóstico',
        'Hospitalización con habitación privada',
        'Cirugías ambulatorias y de internación',
        'Urgencias 24/7',
        'Prevención',
        'Odontología completa',
        'Fisioterapia',
        'Ambulancia',
      ],
    },
    {
      nombre: 'Plan Internacional',
      tipo: 'internacional',
      precio_base_mensual: 280,
      deducible_anual: 100,
      coaseguro: 5,
      cobertura_maxima: 500000,
      descripcion: 'Cobertura internacional con repatriación',
      coberturas_incluidas: [
        'Cobertura nacional completa',
        'Cobertura internacional',
        'Repatriación médica',
        'Traslado médico de emergencia',
        'Seguro de viaje',
        'Asistencia en el extranjero',
        'Médicos internacionales',
        'Hospitalización VIP',
        'Segunda opinión médica',
      ],
    },
  ];

  // Factores de edad para salud
  private rangosEdadSalud: RangoEdadSalud[] = [
    { edad_min: 0, edad_max: 17, factor_edad: 0.7 },
    { edad_min: 18, edad_max: 25, factor_edad: 0.8 },
    { edad_min: 26, edad_max: 35, factor_edad: 1.0 },
    { edad_min: 36, edad_max: 45, factor_edad: 1.2 },
    { edad_min: 46, edad_max: 55, factor_edad: 1.5 },
    { edad_min: 56, edad_max: 65, factor_edad: 2.0 },
    { edad_min: 66, edad_max: 120, factor_edad: 2.5 },
  ];

  // Enfermedades preexistentes y sus factores de ajuste
  private enfermedadesPreexistentes: { [key: string]: number } = {
    hipertension: 1.3,
    tiroides: 1.2,
    colesterol_alto: 1.25,
    asma: 1.4,
    gastritis: 1.1,
    diabetes: 1.8,
    gota: 1.15,
    cirugias_previas: 1.35,
  };

  // Data de actividades económicas SCTR con tasas (simulando SUNAFIL/APSEG)
  private actividadesSctrData: ActividadSctrData[] = [
    // Actividades de bajo riesgo
    { codigo: '0111', descripcion: 'Cultivo de cereales', tasa: 0.008 },
    { codigo: '0112', descripcion: 'Cultivo de hortalizas', tasa: 0.009 },
    { codigo: '0113', descripcion: 'Cultivo de frutas', tasa: 0.010 },
    { codigo: '0121', descripcion: 'Cría de ganado bovino', tasa: 0.012 },
    { codigo: '0122', descripcion: 'Cría de ganado ovino', tasa: 0.011 },
    { codigo: '0123', descripcion: 'Cría de ganado porcino', tasa: 0.013 },
    { codigo: '0130', descripcion: 'Cultivo de productos agrícolas mixtos', tasa: 0.009 },
    { codigo: '0141', descripcion: 'Servicios agrícolas', tasa: 0.008 },
    { codigo: '0142', descripcion: 'Servicios ganaderos', tasa: 0.010 },
    { codigo: '0150', descripcion: 'Caza, captura de animales y servicios conexos', tasa: 0.015 },

    // Actividades de riesgo medio
    { codigo: '1010', descripcion: 'Extracción y preparación de carbón de piedra', tasa: 0.025 },
    { codigo: '1020', descripcion: 'Extracción y preparación de lignito', tasa: 0.022 },
    { codigo: '1030', descripcion: 'Extracción y preparación de turba', tasa: 0.020 },
    { codigo: '1410', descripcion: 'Extracción de piedra, arena y arcilla', tasa: 0.018 },
    { codigo: '1421', descripcion: 'Extracción de minerales para la fabricación de abonos', tasa: 0.016 },
    { codigo: '1422', descripcion: 'Extracción de sal', tasa: 0.014 },
    { codigo: '1511', descripcion: 'Producción, procesamiento y conservación de carne', tasa: 0.019 },
    { codigo: '1512', descripcion: 'Procesamiento y conservación de pescado', tasa: 0.021 },
    { codigo: '1513', descripcion: 'Procesamiento y conservación de frutas y hortalizas', tasa: 0.017 },
    { codigo: '1520', descripcion: 'Fabricación de productos lácteos', tasa: 0.016 },
    { codigo: '1531', descripcion: 'Molienda de trigo', tasa: 0.015 },
    { codigo: '1532', descripcion: 'Fabricación de almidones y productos de almidón', tasa: 0.014 },
    { codigo: '1533', descripcion: 'Fabricación de alimentos preparados para animales', tasa: 0.013 },
    { codigo: '1541', descripcion: 'Fabricación de aceites y grasas', tasa: 0.018 },
    { codigo: '1542', descripcion: 'Fabricación de azúcar', tasa: 0.016 },
    { codigo: '1543', descripcion: 'Fabricación de cacao, chocolate y productos de confitería', tasa: 0.015 },
    { codigo: '1544', descripcion: 'Fabricación de pastas alimenticias', tasa: 0.014 },
    { codigo: '1549', descripcion: 'Fabricación de otros productos alimenticios', tasa: 0.016 },
    { codigo: '1551', descripcion: 'Destilación, rectificación y mezcla de bebidas alcohólicas', tasa: 0.020 },
    { codigo: '1552', descripcion: 'Fabricación de vinos', tasa: 0.017 },
    { codigo: '1553', descripcion: 'Fabricación de malta', tasa: 0.015 },
    { codigo: '1554', descripcion: 'Fabricación de bebidas no alcohólicas', tasa: 0.014 },
    { codigo: '1600', descripcion: 'Fabricación de tabaco', tasa: 0.019 },
    { codigo: '1711', descripcion: 'Fabricación de hilados de fibras textiles', tasa: 0.013 },
    { codigo: '1712', descripcion: 'Fabricación de tejidos', tasa: 0.012 },
    { codigo: '1721', descripcion: 'Fabricación de artículos de punto', tasa: 0.011 },
    { codigo: '1722', descripcion: 'Fabricación de artículos confeccionados', tasa: 0.010 },
    { codigo: '1723', descripcion: 'Fabricación de artículos de piel', tasa: 0.014 },
    { codigo: '1730', descripcion: 'Acabado de textiles', tasa: 0.013 },
    { codigo: '1810', descripcion: 'Fabricación de prendas de vestir', tasa: 0.009 },
    { codigo: '1820', descripcion: 'Fabricación de artículos de piel y similares', tasa: 0.012 },
    { codigo: '1910', descripcion: 'Curtido y preparación de cueros', tasa: 0.016 },
    { codigo: '1920', descripcion: 'Fabricación de maletas, bolsos y artículos similares', tasa: 0.011 },
    { codigo: '2010', descripcion: 'Aserrado y cepillado de madera', tasa: 0.022 },
    { codigo: '2021', descripcion: 'Fabricación de chapas y hojas de madera', tasa: 0.019 },
    { codigo: '2022', descripcion: 'Fabricación de partes y piezas de carpintería', tasa: 0.017 },
    { codigo: '2023', descripcion: 'Fabricación de envases de madera', tasa: 0.015 },
    { codigo: '2029', descripcion: 'Fabricación de otros productos de madera', tasa: 0.016 },
    { codigo: '2101', descripcion: 'Fabricación de pasta de madera', tasa: 0.018 },
    { codigo: '2102', descripcion: 'Fabricación de papel y cartón', tasa: 0.015 },
    { codigo: '2109', descripcion: 'Fabricación de otros artículos de pasta, papel y cartón', tasa: 0.014 },
    { codigo: '2211', descripcion: 'Edición de libros', tasa: 0.008 },
    { codigo: '2212', descripcion: 'Edición de periódicos, revistas y publicaciones periódicas', tasa: 0.009 },
    { codigo: '2213', descripcion: 'Edición de grabaciones', tasa: 0.007 },
    { codigo: '2219', descripcion: 'Otras actividades de edición', tasa: 0.008 },
    { codigo: '2221', descripcion: 'Impresión', tasa: 0.011 },
    { codigo: '2222', descripcion: 'Servicios relacionados con la impresión', tasa: 0.010 },
    { codigo: '2230', descripcion: 'Reproducción de grabaciones', tasa: 0.009 },
    { codigo: '2310', descripcion: 'Fabricación de productos de hornos de coque', tasa: 0.025 },
    { codigo: '2320', descripcion: 'Fabricación de productos de la refinación del petróleo', tasa: 0.028 },
    { codigo: '2330', descripcion: 'Fabricación de combustible nuclear', tasa: 0.030 },
    { codigo: '2411', descripcion: 'Fabricación de sustancias químicas básicas', tasa: 0.024 },
    { codigo: '2412', descripcion: 'Fabricación de abonos y compuestos de nitrógeno', tasa: 0.022 },
    { codigo: '2413', descripcion: 'Fabricación de plásticos en formas primarias', tasa: 0.020 },
    { codigo: '2421', descripcion: 'Fabricación de plaguicidas y otros productos químicos de uso agropecuario', tasa: 0.026 },
    { codigo: '2422', descripcion: 'Fabricación de pinturas, barnices y productos similares', tasa: 0.018 },
    { codigo: '2423', descripcion: 'Fabricación de jabones, detergentes y preparados de limpieza', tasa: 0.016 },
    { codigo: '2424', descripcion: 'Fabricación de perfumes y preparados de tocador', tasa: 0.014 },
    { codigo: '2429', descripcion: 'Fabricación de otros productos químicos', tasa: 0.019 },
    { codigo: '2430', descripcion: 'Fabricación de fibras artificiales', tasa: 0.021 },
    { codigo: '2511', descripcion: 'Fabricación de neumáticos y cámaras de aire', tasa: 0.017 },
    { codigo: '2519', descripcion: 'Fabricación de otros productos de caucho', tasa: 0.015 },
    { codigo: '2520', descripcion: 'Fabricación de productos de plástico', tasa: 0.014 },
    { codigo: '2610', descripcion: 'Fabricación de vidrio y productos de vidrio', tasa: 0.016 },
    { codigo: '2621', descripcion: 'Fabricación de productos cerámicos para la construcción', tasa: 0.015 },
    { codigo: '2622', descripcion: 'Fabricación de otros productos cerámicos', tasa: 0.014 },
    { codigo: '2623', descripcion: 'Fabricación de productos de arcilla cocida para la construcción', tasa: 0.016 },
    { codigo: '2624', descripcion: 'Fabricación de otros productos de porcelana y cerámica', tasa: 0.013 },
    { codigo: '2625', descripcion: 'Fabricación de cemento, cal y yeso', tasa: 0.018 },
    { codigo: '2626', descripcion: 'Fabricación de artículos de hormigón, cemento y yeso', tasa: 0.016 },
    { codigo: '2630', descripcion: 'Fabricación de artículos de piedra', tasa: 0.017 },
    { codigo: '2640', descripcion: 'Fabricación de otros productos minerales no metálicos', tasa: 0.015 },
    { codigo: '2710', descripcion: 'Fabricación de hierro y acero primario', tasa: 0.025 },
    { codigo: '2720', descripcion: 'Fabricación de metales preciosos y no ferrosos', tasa: 0.022 },
    { codigo: '2731', descripcion: 'Fundición de hierro y acero', tasa: 0.023 },
    { codigo: '2732', descripcion: 'Fundición de metales no ferrosos', tasa: 0.021 },
    { codigo: '2741', descripcion: 'Forjado, prensado, estampado y laminado de metales', tasa: 0.020 },
    { codigo: '2742', descripcion: 'Tratamiento y revestimiento de metales', tasa: 0.018 },
    { codigo: '2743', descripcion: 'Fabricación de herramientas de mano', tasa: 0.016 },
    { codigo: '2744', descripcion: 'Fabricación de herrajes y cerraduras', tasa: 0.014 },
    { codigo: '2745', descripcion: 'Fabricación de envases y embalajes metálicos', tasa: 0.015 },
    { codigo: '2749', descripcion: 'Fabricación de otros productos metálicos', tasa: 0.016 },
    { codigo: '2811', descripcion: 'Fabricación de motores y turbinas', tasa: 0.019 },
    { codigo: '2812', descripcion: 'Fabricación de equipos de transmisión', tasa: 0.017 },
    { codigo: '2813', descripcion: 'Fabricación de otras máquinas para agricultura', tasa: 0.016 },
    { codigo: '2819', descripcion: 'Fabricación de otras máquinas de uso general', tasa: 0.015 },
    { codigo: '2821', descripcion: 'Fabricación de hornos y quemadores', tasa: 0.020 },
    { codigo: '2822', descripcion: 'Fabricación de maquinaria para la elaboración de alimentos', tasa: 0.017 },
    { codigo: '2823', descripcion: 'Fabricación de maquinaria para la elaboración de bebidas', tasa: 0.016 },
    { codigo: '2824', descripcion: 'Fabricación de maquinaria para la industria del tabaco', tasa: 0.018 },
    { codigo: '2825', descripcion: 'Fabricación de maquinaria para la industria textil', tasa: 0.015 },
    { codigo: '2826', descripcion: 'Fabricación de maquinaria para la industria del cuero y piel', tasa: 0.016 },
    { codigo: '2829', descripcion: 'Fabricación de otras máquinas de uso especial', tasa: 0.017 },
    { codigo: '2830', descripcion: 'Fabricación de maquinaria agrícola y forestal', tasa: 0.019 },
    { codigo: '2840', descripcion: 'Fabricación de máquinas herramienta', tasa: 0.018 },
    { codigo: '2851', descripcion: 'Tratamiento y revestimiento de metales', tasa: 0.020 },
    { codigo: '2852', descripcion: 'Fabricación de armas y municiones', tasa: 0.025 },
    { codigo: '2853', descripcion: 'Fabricación de equipos de oficina', tasa: 0.012 },
    { codigo: '2859', descripcion: 'Fabricación de otros equipos de uso especial', tasa: 0.016 },
    { codigo: '2911', descripcion: 'Fabricación de motores de combustión interna', tasa: 0.019 },
    { codigo: '2912', descripcion: 'Fabricación de bombas, compresores, grifos y válvulas', tasa: 0.017 },
    { codigo: '2913', descripcion: 'Fabricación de cojinetes, engranajes y órganos mecánicos de transmisión', tasa: 0.016 },
    { codigo: '2914', descripcion: 'Fabricación de hornos, hogares y quemadores', tasa: 0.020 },
    { codigo: '2915', descripcion: 'Fabricación de equipos de elevación y manipulación', tasa: 0.021 },
    { codigo: '2919', descripcion: 'Fabricación de otros equipos de uso general', tasa: 0.015 },
    { codigo: '2921', descripcion: 'Fabricación de maquinaria agrícola y forestal', tasa: 0.019 },
    { codigo: '2922', descripcion: 'Fabricación de máquinas herramienta', tasa: 0.018 },
    { codigo: '2923', descripcion: 'Fabricación de maquinaria para la metalurgia', tasa: 0.022 },
    { codigo: '2924', descripcion: 'Fabricación de maquinaria para las industrias extractivas', tasa: 0.025 },
    { codigo: '2925', descripcion: 'Fabricación de maquinaria para la construcción', tasa: 0.023 },
    { codigo: '2926', descripcion: 'Fabricación de maquinaria para la industria manufacturera', tasa: 0.017 },
    { codigo: '2927', descripcion: 'Fabricación de aparatos domésticos no eléctricos', tasa: 0.014 },
    { codigo: '2929', descripcion: 'Fabricación de otras máquinas de uso especial', tasa: 0.016 },
    { codigo: '2930', descripcion: 'Fabricación de aparatos de uso doméstico', tasa: 0.013 },
    { codigo: '3000', descripcion: 'Fabricación de maquinaria de oficina, contabilidad e informática', tasa: 0.011 },
    { codigo: '3110', descripcion: 'Fabricación de motores, generadores y transformadores eléctricos', tasa: 0.016 },
    { codigo: '3120', descripcion: 'Fabricación de aparatos de distribución y control de la energía eléctrica', tasa: 0.015 },
    { codigo: '3130', descripcion: 'Fabricación de hilos y cables aislados', tasa: 0.014 },
    { codigo: '3140', descripcion: 'Fabricación de acumuladores y pilas', tasa: 0.017 },
    { codigo: '3150', descripcion: 'Fabricación de lámparas y equipos de iluminación', tasa: 0.013 },
    { codigo: '3190', descripcion: 'Fabricación de otros equipos eléctricos', tasa: 0.014 },
    { codigo: '3210', descripcion: 'Fabricación de tubos y válvulas electrónicas', tasa: 0.015 },
    { codigo: '3220', descripcion: 'Fabricación de transmisores de radio y televisión', tasa: 0.013 },
    { codigo: '3230', descripcion: 'Fabricación de receptores de radio y televisión', tasa: 0.012 },
    { codigo: '3311', descripcion: 'Fabricación de equipos médicos y quirúrgicos', tasa: 0.014 },
    { codigo: '3312', descripcion: 'Fabricación de aparatos e instrumentos de medida', tasa: 0.013 },
    { codigo: '3313', descripcion: 'Fabricación de equipos de control de procesos industriales', tasa: 0.016 },
    { codigo: '3320', descripcion: 'Fabricación de instrumentos ópticos y equipos fotográficos', tasa: 0.012 },
    { codigo: '3330', descripcion: 'Fabricación de relojes', tasa: 0.010 },
    { codigo: '3410', descripcion: 'Fabricación de vehículos automóviles', tasa: 0.017 },
    { codigo: '3420', descripcion: 'Fabricación de carrocerías para vehículos automóviles', tasa: 0.016 },
    { codigo: '3430', descripcion: 'Fabricación de partes y piezas para vehículos automóviles', tasa: 0.015 },
    { codigo: '3511', descripcion: 'Construcción y reparación de buques', tasa: 0.022 },
    { codigo: '3512', descripcion: 'Construcción y reparación de embarcaciones de recreo', tasa: 0.019 },
    { codigo: '3520', descripcion: 'Fabricación de locomotoras y material rodante', tasa: 0.020 },
    { codigo: '3530', descripcion: 'Fabricación de aeronaves y naves espaciales', tasa: 0.025 },
    { codigo: '3540', descripcion: 'Fabricación de motocicletas', tasa: 0.018 },
    { codigo: '3550', descripcion: 'Fabricación de otros equipos de transporte', tasa: 0.017 },
    { codigo: '3610', descripcion: 'Fabricación de muebles', tasa: 0.013 },
    { codigo: '3620', descripcion: 'Fabricación de joyas y artículos conexos', tasa: 0.011 },
    { codigo: '3630', descripcion: 'Fabricación de instrumentos musicales', tasa: 0.010 },
    { codigo: '3640', descripcion: 'Fabricación de artículos de deporte', tasa: 0.009 },
    { codigo: '3650', descripcion: 'Fabricación de juegos y juguetes', tasa: 0.008 },
    { codigo: '3661', descripcion: 'Fabricación de productos de caucho', tasa: 0.015 },
    { codigo: '3662', descripcion: 'Fabricación de productos de plástico', tasa: 0.014 },
    { codigo: '3663', descripcion: 'Fabricación de otros productos manufacturados', tasa: 0.013 },
    { codigo: '3669', descripcion: 'Fabricación de otros productos manufacturados n.c.p.', tasa: 0.012 },
    { codigo: '3710', descripcion: 'Reciclamiento de metales ferrosos', tasa: 0.020 },
    { codigo: '3720', descripcion: 'Reciclamiento de metales no ferrosos', tasa: 0.018 },
    { codigo: '4010', descripcion: 'Producción, transmisión y distribución de energía eléctrica', tasa: 0.016 },
    { codigo: '4020', descripcion: 'Fabricación de gas', tasa: 0.015 },
    { codigo: '4030', descripcion: 'Distribución de vapor y agua caliente', tasa: 0.014 },
    { codigo: '4100', descripcion: 'Captación, depuración y distribución de agua', tasa: 0.013 },
    { codigo: '4510', descripcion: 'Venta al por mayor y al por menor de vehículos automóviles', tasa: 0.010 },
    { codigo: '4520', descripcion: 'Mantenimiento y reparación de vehículos automóviles', tasa: 0.014 },
    { codigo: '4530', descripcion: 'Venta de piezas, partes y accesorios para vehículos automóviles', tasa: 0.011 },
    { codigo: '4540', descripcion: 'Venta, mantenimiento y reparación de motocicletas', tasa: 0.013 },
    { codigo: '4550', descripcion: 'Venta al por menor de combustible para vehículos automotores', tasa: 0.012 },
    { codigo: '5010', descripcion: 'Venta al por mayor y al por menor de productos textiles', tasa: 0.009 },
    { codigo: '5020', descripcion: 'Venta al por mayor y al por menor de productos químicos', tasa: 0.011 },
    { codigo: '5030', descripcion: 'Venta al por mayor y al por menor de maquinaria y equipo', tasa: 0.010 },
    { codigo: '5040', descripcion: 'Venta al por mayor y al por menor de productos farmacéuticos', tasa: 0.009 },
    { codigo: '5050', descripcion: 'Venta al por mayor y al por menor de otros productos', tasa: 0.008 },
    { codigo: '5110', descripcion: 'Venta al por menor en almacenes no especializados', tasa: 0.007 },
    { codigo: '5121', descripcion: 'Venta al por menor de productos alimenticios', tasa: 0.008 },
    { codigo: '5122', descripcion: 'Venta al por menor de bebidas', tasa: 0.009 },
    { codigo: '5131', descripcion: 'Venta al por menor de productos textiles', tasa: 0.007 },
    { codigo: '5139', descripcion: 'Venta al por menor de otros productos nuevos en almacenes especializados', tasa: 0.008 },
    { codigo: '5140', descripcion: 'Venta al por menor de productos usados', tasa: 0.010 },
    { codigo: '5150', descripcion: 'Venta al por menor en puestos de venta y mercados', tasa: 0.009 },
    { codigo: '5190', descripcion: 'Otras actividades de venta al por menor', tasa: 0.008 },
    { codigo: '5211', descripcion: 'Comercio al por menor no especializado con predominio de productos alimenticios', tasa: 0.007 },
    { codigo: '5219', descripcion: 'Otro comercio al por menor no especializado', tasa: 0.008 },
    { codigo: '5220', descripcion: 'Reparación de artículos personales y del hogar', tasa: 0.011 },
    { codigo: '5230', descripcion: 'Venta al por menor de combustible', tasa: 0.012 },
    { codigo: '5240', descripcion: 'Venta al por menor de otros productos en almacenes especializados', tasa: 0.009 },
    { codigo: '5251', descripcion: 'Venta al por menor en grandes almacenes', tasa: 0.008 },
    { codigo: '5259', descripcion: 'Otra venta al por menor en almacenes no especializados', tasa: 0.007 },
    { codigo: '5260', descripcion: 'Reparación de efectos personales y enseres domésticos', tasa: 0.010 },
    { codigo: '5511', descripcion: 'Hoteles', tasa: 0.008 },
    { codigo: '5519', descripcion: 'Otros alojamientos', tasa: 0.007 },
    { codigo: '5520', descripcion: 'Restaurantes', tasa: 0.009 },
    { codigo: '5530', descripcion: 'Bares y cantinas', tasa: 0.010 },
    { codigo: '5540', descripcion: 'Servicios de comidas y bebidas prestados en otros establecimientos', tasa: 0.008 },
    { codigo: '5551', descripcion: 'Servicios de comidas prestados por contratos sin especificar el lugar', tasa: 0.007 },
    { codigo: '5552', descripcion: 'Servicios de bebidas prestados por contratos sin especificar el lugar', tasa: 0.008 },
    { codigo: '6010', descripcion: 'Transporte por ferrocarril', tasa: 0.015 },
    { codigo: '6021', descripcion: 'Transporte de carga por carretera', tasa: 0.018 },
    { codigo: '6022', descripcion: 'Transporte de pasajeros por carretera', tasa: 0.016 },
    { codigo: '6023', descripcion: 'Transporte por tuberías', tasa: 0.014 },
    { codigo: '6110', descripcion: 'Transporte marítimo', tasa: 0.020 },
    { codigo: '6120', descripcion: 'Transporte fluvial', tasa: 0.017 },
    { codigo: '6210', descripcion: 'Transporte aéreo', tasa: 0.019 },
    { codigo: '6220', descripcion: 'Transporte espacial', tasa: 0.025 },
    { codigo: '6311', descripcion: 'Manipulación de carga', tasa: 0.016 },
    { codigo: '6312', descripcion: 'Almacenamiento y depósito', tasa: 0.013 },
    { codigo: '6321', descripcion: 'Actividades de agencias de viaje', tasa: 0.008 },
    { codigo: '6329', descripcion: 'Otras actividades auxiliares del transporte', tasa: 0.010 },
    { codigo: '6330', descripcion: 'Actividades de agencias de viajes y operadores turísticos', tasa: 0.009 },
    { codigo: '6411', descripcion: 'Actividades postales', tasa: 0.011 },
    { codigo: '6419', descripcion: 'Otras actividades de correos', tasa: 0.010 },
    { codigo: '6420', descripcion: 'Telecomunicaciones', tasa: 0.012 },
    { codigo: '6511', descripcion: 'Bancos centrales', tasa: 0.006 },
    { codigo: '6519', descripcion: 'Otros intermediarios monetarios', tasa: 0.007 },
    { codigo: '6591', descripcion: 'Arrendamiento financiero', tasa: 0.008 },
    { codigo: '6592', descripcion: 'Otras actividades crediticias', tasa: 0.009 },
    { codigo: '6599', descripcion: 'Otras actividades auxiliares financieras', tasa: 0.008 },
    { codigo: '6601', descripcion: 'Seguros de vida', tasa: 0.005 },
    { codigo: '6602', descripcion: 'Pensiones', tasa: 0.006 },
    { codigo: '6603', descripcion: 'Reaseguros', tasa: 0.007 },
    { codigo: '6711', descripcion: 'Administración de mercados financieros', tasa: 0.008 },
    { codigo: '6712', descripcion: 'Actividades de corredores de valores', tasa: 0.009 },
    { codigo: '6719', descripcion: 'Otras actividades auxiliares de las transacciones financieras', tasa: 0.008 },
    { codigo: '6720', descripcion: 'Actividades auxiliares de seguros y fondos de pensiones', tasa: 0.007 },
    { codigo: '7010', descripcion: 'Actividades inmobiliarias', tasa: 0.008 },
    { codigo: '7020', descripcion: 'Alquiler de bienes inmuebles', tasa: 0.007 },
    { codigo: '7031', descripcion: 'Alquiler de maquinaria y equipo sin operarios', tasa: 0.011 },
    { codigo: '7032', descripcion: 'Alquiler de maquinaria y equipo con operarios', tasa: 0.014 },
    { codigo: '7040', descripcion: 'Alquiler de propiedad intelectual', tasa: 0.006 },
    { codigo: '7050', descripcion: 'Alquiler de otros bienes muebles', tasa: 0.009 },
    { codigo: '7111', descripcion: 'Alquiler de automóviles', tasa: 0.010 },
    { codigo: '7119', descripcion: 'Alquiler de otros medios de transporte terrestre', tasa: 0.011 },
    { codigo: '7121', descripcion: 'Alquiler de embarcaciones', tasa: 0.012 },
    { codigo: '7129', descripcion: 'Alquiler de otros medios de transporte por agua', tasa: 0.013 },
    { codigo: '7130', descripcion: 'Alquiler de aeronaves', tasa: 0.015 },
    { codigo: '7140', descripcion: 'Alquiler de equipo de transporte', tasa: 0.011 },
    { codigo: '7210', descripcion: 'Consultores en equipo informático', tasa: 0.007 },
    { codigo: '7220', descripcion: 'Desarrollo de software y consultoría informática', tasa: 0.008 },
    { codigo: '7230', descripcion: 'Procesamiento de datos', tasa: 0.009 },
    { codigo: '7240', descripcion: 'Actividades relacionadas con bases de datos', tasa: 0.008 },
    { codigo: '7250', descripcion: 'Mantenimiento y reparación de maquinaria de oficina', tasa: 0.011 },
    { codigo: '7290', descripcion: 'Otras actividades de informática', tasa: 0.010 },
    { codigo: '7310', descripcion: 'Investigación y desarrollo experimental en ciencias naturales y técnicas', tasa: 0.009 },
    { codigo: '7320', descripcion: 'Investigación y desarrollo experimental en ciencias sociales y humanidades', tasa: 0.007 },
    { codigo: '7411', descripcion: 'Actividades jurídicas', tasa: 0.006 },
    { codigo: '7412', descripcion: 'Actividades de contabilidad y auditoría', tasa: 0.007 },
    { codigo: '7413', descripcion: 'Actividades de asesoramiento fiscal', tasa: 0.008 },
    { codigo: '7414', descripcion: 'Actividades de consultoría de dirección y gestión empresarial', tasa: 0.009 },
    { codigo: '7415', descripcion: 'Actividades de selección y colocación de personal', tasa: 0.008 },
    { codigo: '7421', descripcion: 'Actividades de arquitectura e ingeniería', tasa: 0.010 },
    { codigo: '7422', descripcion: 'Ensayos y análisis técnicos', tasa: 0.011 },
    { codigo: '7430', descripcion: 'Publicidad', tasa: 0.007 },
    { codigo: '7440', descripcion: 'Actividades de investigación de mercados y de opinión pública', tasa: 0.008 },
    { codigo: '7450', descripcion: 'Actividades de colocación de personal', tasa: 0.009 },
    { codigo: '7460', descripcion: 'Actividades de investigación y seguridad', tasa: 0.012 },
    { codigo: '7470', descripcion: 'Limpieza industrial', tasa: 0.013 },
    { codigo: '7481', descripcion: 'Actividades de fotografía', tasa: 0.008 },
    { codigo: '7482', descripcion: 'Actividades de empaquetado', tasa: 0.009 },
    { codigo: '7483', descripcion: 'Actividades de secretariado y traducción', tasa: 0.007 },
    { codigo: '7484', descripcion: 'Actividades de organización de exposiciones y ferias', tasa: 0.008 },
    { codigo: '7485', descripcion: 'Actividades de caligrafía', tasa: 0.006 },
    { codigo: '7486', descripcion: 'Actividades de investigación', tasa: 0.009 },
    { codigo: '7487', descripcion: 'Actividades de consultoría medioambiental', tasa: 0.010 },
    { codigo: '7491', descripcion: 'Actividades de mantenimiento y reparación de maquinaria de oficina', tasa: 0.011 },
    { codigo: '7492', descripcion: 'Actividades de embalaje y empaquetado', tasa: 0.009 },
    { codigo: '7493', descripcion: 'Actividades de limpieza de edificios', tasa: 0.012 },
    { codigo: '7494', descripcion: 'Actividades de investigación fotográfica', tasa: 0.008 },
    { codigo: '7495', descripcion: 'Actividades de organización de congresos y conferencias', tasa: 0.007 },
    { codigo: '7499', descripcion: 'Otras actividades empresariales n.c.p.', tasa: 0.008 },
    { codigo: '7511', descripcion: 'Administración pública general', tasa: 0.007 },
    { codigo: '7512', descripcion: 'Regulación de las actividades de las instituciones que prestan servicios sanitarios', tasa: 0.008 },
    { codigo: '7513', descripcion: 'Regulación de las actividades de las instituciones que prestan servicios sociales', tasa: 0.009 },
    { codigo: '7514', descripcion: 'Regulación de las actividades económicas', tasa: 0.010 },
    { codigo: '7521', descripcion: 'Asuntos exteriores', tasa: 0.006 },
    { codigo: '7522', descripcion: 'Defensa', tasa: 0.012 },
    { codigo: '7523', descripcion: 'Justicia y orden público', tasa: 0.011 },
    { codigo: '7524', descripcion: 'Protección civil', tasa: 0.010 },
    { codigo: '7525', descripcion: 'Bomberos', tasa: 0.013 },
    { codigo: '7530', descripcion: 'Actividades de seguridad social obligatoria', tasa: 0.008 },
    { codigo: '8010', descripcion: 'Enseñanza primaria', tasa: 0.006 },
    { codigo: '8021', descripcion: 'Enseñanza secundaria general', tasa: 0.007 },
    { codigo: '8022', descripcion: 'Enseñanza secundaria técnica y profesional', tasa: 0.008 },
    { codigo: '8030', descripcion: 'Enseñanza superior', tasa: 0.005 },
    { codigo: '8041', descripcion: 'Enseñanza de conducción de vehículos', tasa: 0.009 },
    { codigo: '8042', descripcion: 'Enseñanza de idiomas', tasa: 0.006 },
    { codigo: '8049', descripcion: 'Otras formas de enseñanza', tasa: 0.007 },
    { codigo: '8050', descripcion: 'Otras actividades de enseñanza', tasa: 0.008 },
    { codigo: '8511', descripcion: 'Actividades de hospitales', tasa: 0.011 },
    { codigo: '8512', descripcion: 'Actividades de médicos y odontólogos', tasa: 0.009 },
    { codigo: '8519', descripcion: 'Otras actividades relacionadas con la salud humana', tasa: 0.010 },
    { codigo: '8520', descripcion: 'Actividades veterinarias', tasa: 0.012 },
    { codigo: '8531', descripcion: 'Servicios sociales con alojamiento', tasa: 0.008 },
    { codigo: '8532', descripcion: 'Servicios sociales sin alojamiento', tasa: 0.007 },
    { codigo: '9000', descripcion: 'Eliminación de desperdicios y aguas residuales', tasa: 0.015 },
    { codigo: '9101', descripcion: 'Actividades de organizaciones empresariales y patronales', tasa: 0.006 },
    { codigo: '9102', descripcion: 'Actividades de organizaciones profesionales', tasa: 0.007 },
    { codigo: '9103', descripcion: 'Actividades de organizaciones de trabajadores', tasa: 0.008 },
    { codigo: '9111', descripcion: 'Actividades de organizaciones religiosas', tasa: 0.005 },
    { codigo: '9112', descripcion: 'Actividades de organizaciones políticas', tasa: 0.006 },
    { codigo: '9120', descripcion: 'Actividades de organizaciones juveniles y culturales', tasa: 0.007 },
    { codigo: '9131', descripcion: 'Actividades de organizaciones de beneficencia', tasa: 0.008 },
    { codigo: '9132', descripcion: 'Actividades de organizaciones medioambientales', tasa: 0.009 },
    { codigo: '9133', descripcion: 'Actividades de organizaciones cívicas', tasa: 0.007 },
    { codigo: '9191', descripcion: 'Actividades de clubes deportivos', tasa: 0.010 },
    { codigo: '9192', descripcion: 'Actividades de clubes recreativos', tasa: 0.008 },
    { codigo: '9199', descripcion: 'Otras actividades asociativas', tasa: 0.007 },
    { codigo: '9211', descripcion: 'Producción de películas cinematográficas', tasa: 0.009 },
    { codigo: '9212', descripcion: 'Distribución de películas cinematográficas', tasa: 0.008 },
    { codigo: '9213', descripcion: 'Exhibición de películas cinematográficas', tasa: 0.007 },
    { codigo: '9214', descripcion: 'Actividades de televisión', tasa: 0.008 },
    { codigo: '9219', descripcion: 'Otras actividades cinematográficas y de vídeo', tasa: 0.009 },
    { codigo: '9220', descripcion: 'Actividades de radio y televisión', tasa: 0.008 },
    { codigo: '9231', descripcion: 'Actividades artísticas', tasa: 0.007 },
    { codigo: '9232', descripcion: 'Actividades de gestión de salas de espectáculos', tasa: 0.008 },
    { codigo: '9233', descripcion: 'Actividades de ferias y parques de atracciones', tasa: 0.009 },
    { codigo: '9241', descripcion: 'Actividades deportivas', tasa: 0.010 },
    { codigo: '9249', descripcion: 'Otras actividades recreativas', tasa: 0.008 },
    { codigo: '9301', descripcion: 'Lavado y limpieza de prendas de vestir y otros artículos textiles', tasa: 0.009 },
    { codigo: '9302', descripcion: 'Peluquería y otros tratamientos de belleza', tasa: 0.007 },
    { codigo: '9303', descripcion: 'Pompas fúnebres y actividades conexas', tasa: 0.008 },
    { codigo: '9309', descripcion: 'Otras actividades de servicios personales', tasa: 0.008 },
    { codigo: '9500', descripcion: 'Hogares con servicio doméstico', tasa: 0.012 },
    { codigo: '9900', descripcion: 'Actividades de organizaciones y organismos extraterritoriales', tasa: 0.006 },

    // Actividades de alto riesgo
    { codigo: '1110', descripcion: 'Extracción de petróleo crudo y gas natural', tasa: 0.035 },
    { codigo: '1120', descripcion: 'Servicios relacionados con la extracción de petróleo y gas', tasa: 0.032 },
    { codigo: '1200', descripcion: 'Extracción de minerales de uranio y torio', tasa: 0.040 },
    { codigo: '1310', descripcion: 'Extracción de minerales de hierro', tasa: 0.030 },
    { codigo: '1320', descripcion: 'Extracción de minerales no ferrosos', tasa: 0.028 },
    { codigo: '1410', descripcion: 'Extracción de piedra, arena y arcilla', tasa: 0.025 },
    { codigo: '1429', descripcion: 'Extracción de otros minerales no metálicos', tasa: 0.026 },
    { codigo: '1514', descripcion: 'Fabricación de margarina y grasas comestibles similares', tasa: 0.022 },
    { codigo: '1555', descripcion: 'Fabricación de cerveza', tasa: 0.020 },
    { codigo: '1600', descripcion: 'Fabricación de tabaco', tasa: 0.024 },
    { codigo: '2010', descripcion: 'Aserrado y cepillado de madera', tasa: 0.028 },
    { codigo: '2310', descripcion: 'Fabricación de productos de hornos de coque', tasa: 0.035 },
    { codigo: '2320', descripcion: 'Fabricación de productos de la refinación del petróleo', tasa: 0.038 },
    { codigo: '2330', descripcion: 'Fabricación de combustible nuclear', tasa: 0.045 },
    { codigo: '2411', descripcion: 'Fabricación de sustancias químicas básicas', tasa: 0.032 },
    { codigo: '2412', descripcion: 'Fabricación de abonos y compuestos de nitrógeno', tasa: 0.030 },
    { codigo: '2413', descripcion: 'Fabricación de plásticos en formas primarias', tasa: 0.028 },
    { codigo: '2421', descripcion: 'Fabricación de plaguicidas y otros productos químicos de uso agropecuario', tasa: 0.035 },
    { codigo: '2710', descripcion: 'Fabricación de hierro y acero primario', tasa: 0.033 },
    { codigo: '2720', descripcion: 'Fabricación de metales preciosos y no ferrosos', tasa: 0.031 },
    { codigo: '2731', descripcion: 'Fundición de hierro y acero', tasa: 0.032 },
    { codigo: '2732', descripcion: 'Fundición de metales no ferrosos', tasa: 0.030 },
    { codigo: '2852', descripcion: 'Fabricación de armas y municiones', tasa: 0.036 },
    { codigo: '2924', descripcion: 'Fabricación de maquinaria para las industrias extractivas', tasa: 0.034 },
    { codigo: '2925', descripcion: 'Fabricación de maquinaria para la construcción', tasa: 0.032 },
    { codigo: '3511', descripcion: 'Construcción y reparación de buques', tasa: 0.031 },
    { codigo: '3530', descripcion: 'Fabricación de aeronaves y naves espaciales', tasa: 0.038 },
    { codigo: '3710', descripcion: 'Reciclamiento de metales ferrosos', tasa: 0.029 },
    { codigo: '3720', descripcion: 'Reciclamiento de metales no ferrosos', tasa: 0.027 },
    { codigo: '4510', descripcion: 'Demolición y preparación del terreno', tasa: 0.035 },
    { codigo: '4520', descripcion: 'Construcción de edificios completos y de partes de edificios', tasa: 0.028 },
    { codigo: '4530', descripcion: 'Instalaciones de construcción', tasa: 0.030 },
    { codigo: '4540', descripcion: 'Terminación y acabado de edificios', tasa: 0.025 },
    { codigo: '4550', descripcion: 'Alquiler de equipo de construcción con operarios', tasa: 0.032 },
    { codigo: '5010', descripcion: 'Captación, tratamiento y suministro de agua', tasa: 0.018 },
    { codigo: '5020', descripcion: 'Construcción de otras obras de ingeniería civil', tasa: 0.026 },
    { codigo: '5030', descripcion: 'Instalaciones de fontanería y calefacción', tasa: 0.022 },
    { codigo: '5040', descripcion: 'Instalaciones eléctricas', tasa: 0.024 },
    { codigo: '5050', descripcion: 'Otras instalaciones especializadas', tasa: 0.023 },
    { codigo: '5110', descripcion: 'Comercio al por mayor de productos agrícolas', tasa: 0.012 },
    { codigo: '5120', descripcion: 'Comercio al por mayor de productos alimenticios', tasa: 0.011 },
    { codigo: '5130', descripcion: 'Comercio al por mayor de bebidas', tasa: 0.013 },
    { codigo: '5140', descripcion: 'Comercio al por mayor de productos textiles', tasa: 0.010 },
    { codigo: '5150', descripcion: 'Comercio al por mayor de productos químicos', tasa: 0.014 },
    { codigo: '5160', descripcion: 'Comercio al por mayor de maquinaria y equipo', tasa: 0.012 },
    { codigo: '5170', descripcion: 'Comercio al por mayor de productos farmacéuticos', tasa: 0.011 },
    { codigo: '5180', descripcion: 'Comercio al por mayor de otros productos', tasa: 0.010 },
    { codigo: '5190', descripcion: 'Comercio al por menor en almacenes no especializados', tasa: 0.009 },
    { codigo: '5210', descripcion: 'Comercio al por menor de productos alimenticios', tasa: 0.008 },
    { codigo: '5220', descripcion: 'Comercio al por menor de bebidas', tasa: 0.010 },
    { codigo: '5230', descripcion: 'Comercio al por menor de productos textiles', tasa: 0.007 },
    { codigo: '5240', descripcion: 'Comercio al por menor de otros productos nuevos en almacenes especializados', tasa: 0.008 },
    { codigo: '5250', descripcion: 'Comercio al por menor de productos usados', tasa: 0.011 },
    { codigo: '5260', descripcion: 'Venta al por menor en puestos de venta y mercados', tasa: 0.009 },
    { codigo: '5270', descripcion: 'Reparación de artículos personales y del hogar', tasa: 0.012 },
    { codigo: '5510', descripcion: 'Hoteles y similares', tasa: 0.008 },
    { codigo: '5520', descripcion: 'Restaurantes y cantinas', tasa: 0.009 },
    { codigo: '6010', descripcion: 'Transporte por ferrocarril', tasa: 0.020 },
    { codigo: '6020', descripcion: 'Transporte por carretera', tasa: 0.022 },
    { codigo: '6030', descripcion: 'Transporte por tuberías', tasa: 0.018 },
    { codigo: '6110', descripcion: 'Transporte marítimo', tasa: 0.025 },
    { codigo: '6120', descripcion: 'Transporte fluvial', tasa: 0.021 },
    { codigo: '6210', descripcion: 'Transporte aéreo', tasa: 0.028 },
    { codigo: '6220', descripcion: 'Transporte espacial', tasa: 0.035 },
    { codigo: '6310', descripcion: 'Manipulación de carga', tasa: 0.019 },
    { codigo: '6320', descripcion: 'Almacenamiento y depósito', tasa: 0.016 },
    { codigo: '6330', descripcion: 'Actividades de agencias de viaje', tasa: 0.008 },
    { codigo: '6340', descripcion: 'Otras actividades auxiliares del transporte', tasa: 0.011 },
    { codigo: '6410', descripcion: 'Actividades postales', tasa: 0.013 },
    { codigo: '6420', descripcion: 'Telecomunicaciones', tasa: 0.014 },
    { codigo: '6510', descripcion: 'Bancos centrales', tasa: 0.006 },
    { codigo: '6590', descripcion: 'Otras actividades financieras', tasa: 0.008 },
    { codigo: '6600', descripcion: 'Seguros', tasa: 0.007 },
    { codigo: '6710', descripcion: 'Actividades auxiliares financieras', tasa: 0.009 },
    { codigo: '6720', descripcion: 'Actividades auxiliares de seguros', tasa: 0.008 },
    { codigo: '7010', descripcion: 'Actividades inmobiliarias', tasa: 0.008 },
    { codigo: '7020', descripcion: 'Alquiler de bienes inmuebles', tasa: 0.007 },
    { codigo: '7030', descripcion: 'Alquiler de maquinaria y equipo', tasa: 0.012 },
    { codigo: '7040', descripcion: 'Alquiler de propiedad intelectual', tasa: 0.006 },
    { codigo: '7110', descripcion: 'Alquiler de automóviles', tasa: 0.010 },
    { codigo: '7120', descripcion: 'Alquiler de otros medios de transporte', tasa: 0.011 },
    { codigo: '7210', descripcion: 'Consultores en equipo informático', tasa: 0.007 },
    { codigo: '7220', descripcion: 'Desarrollo de software', tasa: 0.008 },
    { codigo: '7230', descripcion: 'Procesamiento de datos', tasa: 0.009 },
    { codigo: '7240', descripcion: 'Actividades relacionadas con bases de datos', tasa: 0.008 },
    { codigo: '7250', descripcion: 'Mantenimiento de maquinaria de oficina', tasa: 0.011 },
    { codigo: '7290', descripcion: 'Otras actividades de informática', tasa: 0.010 },
    { codigo: '7310', descripcion: 'Investigación y desarrollo', tasa: 0.009 },
    { codigo: '7410', descripcion: 'Actividades jurídicas', tasa: 0.006 },
    { codigo: '7420', descripcion: 'Actividades de arquitectura e ingeniería', tasa: 0.010 },
    { codigo: '7430', descripcion: 'Publicidad', tasa: 0.007 },
    { codigo: '7440', descripcion: 'Investigación de mercados', tasa: 0.008 },
    { codigo: '7450', descripcion: 'Colocación de personal', tasa: 0.009 },
    { codigo: '7460', descripcion: 'Investigación y seguridad', tasa: 0.012 },
    { codigo: '7470', descripcion: 'Limpieza industrial', tasa: 0.013 },
    { codigo: '7480', descripcion: 'Otras actividades empresariales', tasa: 0.008 },
    { codigo: '7510', descripcion: 'Administración pública', tasa: 0.007 },
    { codigo: '7520', descripcion: 'Defensa', tasa: 0.012 },
    { codigo: '7530', descripcion: 'Seguridad social', tasa: 0.008 },
    { codigo: '8010', descripcion: 'Enseñanza primaria', tasa: 0.006 },
    { codigo: '8020', descripcion: 'Enseñanza secundaria', tasa: 0.007 },
    { codigo: '8030', descripcion: 'Enseñanza superior', tasa: 0.005 },
    { codigo: '8040', descripcion: 'Educación para adultos', tasa: 0.007 },
    { codigo: '8050', descripcion: 'Otras actividades de enseñanza', tasa: 0.008 },
    { codigo: '8510', descripcion: 'Actividades de salud humana', tasa: 0.011 },
    { codigo: '8520', descripcion: 'Actividades veterinarias', tasa: 0.012 },
    { codigo: '8530', descripcion: 'Servicios sociales', tasa: 0.008 },
    { codigo: '9000', descripcion: 'Eliminación de desperdicios', tasa: 0.015 },
    { codigo: '9100', descripcion: 'Actividades de organizaciones', tasa: 0.007 },
    { codigo: '9210', descripcion: 'Actividades cinematográficas', tasa: 0.009 },
    { codigo: '9220', descripcion: 'Actividades de radio y televisión', tasa: 0.008 },
    { codigo: '9230', descripcion: 'Otras actividades recreativas', tasa: 0.008 },
    { codigo: '9300', descripcion: 'Otras actividades de servicios', tasa: 0.008 },
    { codigo: '9500', descripcion: 'Hogares con servicio doméstico', tasa: 0.012 },
    { codigo: '9900', descripcion: 'Organismos extraterritoriales', tasa: 0.006 },
  ];

  // Lista de actividades consideradas de alto riesgo (requieren evaluación especial)
  private actividadesAltoRiesgo: string[] = [
    '1110', // Extracción de petróleo crudo y gas natural
    '1120', // Servicios relacionados con la extracción de petróleo y gas
    '1200', // Extracción de minerales de uranio y torio
    '1310', // Extracción de minerales de hierro
    '1320', // Extracción de minerales no ferrosos
    '1410', // Extracción de piedra, arena y arcilla
    '1429', // Extracción de otros minerales no metálicos
    '1514', // Fabricación de margarina y grasas comestibles similares
    '1555', // Fabricación de cerveza
    '1600', // Fabricación de tabaco
    '2010', // Aserrado y cepillado de madera
    '2310', // Fabricación de productos de hornos de coque
    '2320', // Fabricación de productos de la refinación del petróleo
    '2330', // Fabricación de combustible nuclear
    '2411', // Fabricación de sustancias químicas básicas
    '2412', // Fabricación de abonos y compuestos de nitrógeno
    '2413', // Fabricación de plásticos en formas primarias
    '2421', // Fabricación de plaguicidas y otros productos químicos de uso agropecuario
    '2710', // Fabricación de hierro y acero primario
    '2720', // Fabricación de metales preciosos y no ferrosos
    '2731', // Fundición de hierro y acero
    '2732', // Fundición de metales no ferrosos
    '2852', // Fabricación de armas y municiones
    '2924', // Fabricación de maquinaria para las industrias extractivas
    '2925', // Fabricación de maquinaria para la construcción
    '3511', // Construcción y reparación de buques
    '3530', // Fabricación de aeronaves y naves espaciales
    '3710', // Reciclamiento de metales ferrosos
    '3720', // Reciclamiento de metales no ferrosos
    '4510', // Demolición y preparación del terreno
    '4520', // Construcción de edificios completos y de partes de edificios
    '4530', // Instalaciones de construcción
    '4540', // Terminación y acabado de edificios
    '4550', // Alquiler de equipo de construcción con operarios
    '6110', // Transporte marítimo
    '6210', // Transporte aéreo
    '6220', // Transporte espacial
  ];

  // Sueldo mínimo vital mensual (2024 - Perú)
  private readonly SUELDO_MINIMO_VITAL = 1025;

  // Data de vehículos
  private vehiculosData: VehiculoData[] = [
    // Toyota
    {
      marca: 'Toyota',
      modelo: 'Corolla',
      anio: 2020,
      precio_base: 15000,
      tasa_base: 3.5,
    },
    {
      marca: 'Toyota',
      modelo: 'Corolla',
      anio: 2021,
      precio_base: 16500,
      tasa_base: 3.3,
    },
    {
      marca: 'Toyota',
      modelo: 'Corolla',
      anio: 2022,
      precio_base: 18000,
      tasa_base: 3.1,
    },
    {
      marca: 'Toyota',
      modelo: 'Yaris',
      anio: 2020,
      precio_base: 12000,
      tasa_base: 4.0,
    },
    {
      marca: 'Toyota',
      modelo: 'Yaris',
      anio: 2021,
      precio_base: 13500,
      tasa_base: 3.8,
    },
    {
      marca: 'Toyota',
      modelo: 'RAV4',
      anio: 2020,
      precio_base: 22000,
      tasa_base: 3.2,
    },
    {
      marca: 'Toyota',
      modelo: 'RAV4',
      anio: 2021,
      precio_base: 24000,
      tasa_base: 3.0,
    },
    {
      marca: 'Toyota',
      modelo: 'Sportage',
      anio: 2020,
      precio_base: 19000,
      tasa_base: 3.6,
    },

    // Hyundai
    {
      marca: 'Hyundai',
      modelo: 'Tucson',
      anio: 2020,
      precio_base: 18000,
      tasa_base: 3.8,
    },
    {
      marca: 'Hyundai',
      modelo: 'Tucson',
      anio: 2021,
      precio_base: 19500,
      tasa_base: 3.6,
    },
    {
      marca: 'Hyundai',
      modelo: 'Creta',
      anio: 2020,
      precio_base: 16000,
      tasa_base: 4.2,
    },
    {
      marca: 'Hyundai',
      modelo: 'Creta',
      anio: 2021,
      precio_base: 17500,
      tasa_base: 4.0,
    },

    // Kia
    {
      marca: 'Kia',
      modelo: 'Sportage',
      anio: 2020,
      precio_base: 17000,
      tasa_base: 3.9,
    },
    {
      marca: 'Kia',
      modelo: 'Sportage',
      anio: 2021,
      precio_base: 18500,
      tasa_base: 3.7,
    },
    {
      marca: 'Kia',
      modelo: 'Rio',
      anio: 2020,
      precio_base: 13000,
      tasa_base: 4.1,
    },
    {
      marca: 'Kia',
      modelo: 'Rio',
      anio: 2021,
      precio_base: 14500,
      tasa_base: 3.9,
    },

    // Nissan
    {
      marca: 'Nissan',
      modelo: 'Sentra',
      anio: 2020,
      precio_base: 14000,
      tasa_base: 4.0,
    },
    {
      marca: 'Nissan',
      modelo: 'Sentra',
      anio: 2021,
      precio_base: 15500,
      tasa_base: 3.8,
    },
    {
      marca: 'Nissan',
      modelo: 'Kicks',
      anio: 2020,
      precio_base: 16000,
      tasa_base: 3.7,
    },
    {
      marca: 'Nissan',
      modelo: 'Kicks',
      anio: 2021,
      precio_base: 16500,
      tasa_base: 3.5,
    },

    // Chevrolet
    {
      marca: 'Chevrolet',
      modelo: 'Onix',
      anio: 2020,
      precio_base: 11000,
      tasa_base: 4.5,
    },
    {
      marca: 'Chevrolet',
      modelo: 'Onix',
      anio: 2021,
      precio_base: 12500,
      tasa_base: 4.3,
    },
    {
      marca: 'Chevrolet',
      modelo: 'Tracker',
      anio: 2020,
      precio_base: 14000,
      tasa_base: 4.2,
    },
    {
      marca: 'Chevrolet',
      modelo: 'Tracker',
      anio: 2021,
      precio_base: 15500,
      tasa_base: 4.0,
    },

    // Volkswagen
    {
      marca: 'Volkswagen',
      modelo: 'Virtus',
      anio: 2020,
      precio_base: 13500,
      tasa_base: 4.1,
    },
    {
      marca: 'Volkswagen',
      modelo: 'Virtus',
      anio: 2021,
      precio_base: 15000,
      tasa_base: 3.9,
    },
    {
      marca: 'Volkswagen',
      modelo: 'T-Cross',
      anio: 2020,
      precio_base: 16000,
      tasa_base: 3.8,
    },
    {
      marca: 'Volkswagen',
      modelo: 'T-Cross',
      anio: 2021,
      precio_base: 17500,
      tasa_base: 3.6,
    },
  ];

  async calcularCotizacionAuto(
    dto: CalcularCotizacionAutoDto,
  ): Promise<CotizacionResultDto> {
    const {
      marca,
      modelo,
      anio,
      valor_vehiculo,
      tipo_cobertura,
      zona_riesgo,
      antiguedad_licencia,
    } = dto;

    if (!marca || !modelo || !anio) {
      throw new BadRequestException(
        'Marca, modelo y año son requeridos para cotizar auto',
      );
    }

    // Buscar vehículo en data ficticia
    const vehiculoBase = this.vehiculosData.find(
      (v) =>
        v.marca.toLowerCase() === marca.toLowerCase() &&
        v.modelo.toLowerCase() === modelo.toLowerCase() &&
        v.anio === anio,
    );

    if (!vehiculoBase) {
      throw new BadRequestException(
        `Vehículo ${marca} ${modelo} ${anio} no encontrado en nuestra base de datos`,
      );
    }

    // Determinar valor asegurado (usar valor proporcionado o precio base ±15%)
    const valorAsegurado = valor_vehiculo || vehiculoBase.precio_base;

    // Ajustar tasa base según factores adicionales
    let tasaAjustada = vehiculoBase.tasa_base;

    // Ajuste por zona de riesgo
    if (zona_riesgo === 'Alta') tasaAjustada += 0.5;
    else if (zona_riesgo === 'Baja') tasaAjustada -= 0.3;

    // Ajuste por antigüedad de licencia
    if (antiguedad_licencia < 3) tasaAjustada += 0.8;
    else if (antiguedad_licencia > 10) tasaAjustada -= 0.4;

    // Ajuste por tipo de cobertura
    if (tipo_cobertura === 'Todo riesgo') tasaAjustada += 0.2;
    else if (tipo_cobertura === 'Terceros') tasaAjustada -= 0.5;

    // Calcular primas según la fórmula
    const primaNeta = valorAsegurado * (tasaAjustada / 100);
    const primaComercial = primaNeta * 1.03; // 3% de emisión
    const primaTotal = primaComercial * 1.18; // IGV 18%

    // Determinar deducibles según tipo de cobertura
    const deducibles = this.calcularDeducibles(tipo_cobertura, valorAsegurado);

    // Determinar coberturas disponibles
    const coberturas = this.obtenerCoberturasAuto(tipo_cobertura);

    // Garantías requeridas
    const garantiasRequeridas = this.obtenerGarantiasRequeridas(
      marca,
      modelo,
      anio,
    );

    return {
      tipo_seguro: 'AUTO',
      prima_total: Math.round(primaTotal * 100) / 100,
      prima_neta: Math.round(primaNeta * 100) / 100,
      costo_mensual: Math.round(primaTotal / 12 * 100) / 100,
      costo_anual: Math.round(primaTotal * 100) / 100,
      metadata: {
        primaComercial: Math.round(primaComercial * 100) / 100,
        tasaAplicada: tasaAjustada,
        valorAsegurado,
        deducibles,
        coberturas,
        garantiasRequeridas,
        vehiculoBase: {
          marca: vehiculoBase.marca,
          modelo: vehiculoBase.modelo,
          anio: vehiculoBase.anio,
          precioReferencial: vehiculoBase.precio_base,
        },
      },
    };
  }

  private calcularDeducibles(
    tipoCobertura: string,
    valorVehiculo: number,
  ): number[] {
    const porcentajeBase = tipoCobertura === 'Todo riesgo' ? 0.01 : 0.05; // 1% o 5%
    const deducibleBase = valorVehiculo * porcentajeBase;

    return [
      Math.round(deducibleBase * 100) / 100,
      Math.round(deducibleBase * 1.5 * 100) / 100,
      Math.round(deducibleBase * 2 * 100) / 100,
    ];
  }

  private obtenerCoberturasAuto(tipoCobertura: string): string[] {
    const coberturasBasicas = [
      'Responsabilidad Civil',
      'Asistencia Vial 24/7',
      'Defensa Jurídica',
    ];

    if (tipoCobertura === 'Todo riesgo') {
      return [
        ...coberturasBasicas,
        'Choque',
        'Robo Total',
        'Robo de Autopartes',
        'Daños por Granizo',
        'Incendio Total',
        'Daños por Vandalismo',
      ];
    } else if (tipoCobertura === 'Terceros completo') {
      return [...coberturasBasicas, 'Robo Total', 'Incendio Total'];
    }

    return coberturasBasicas;
  }

  private obtenerGarantiasRequeridas(
    marca: string,
    modelo: string,
    anio: number,
  ): string[] {
    const garantias = ['GPS'];

    // Si no es nuevo, requiere inspección vehicular
    if (anio < new Date().getFullYear()) {
      garantias.push('Inspección Vehicular');
    }

    // Vehículos con mayor riesgo requieren alarma
    const vehiculosAltoRiesgo = ['Onix', 'Rio', 'Virtus'];
    if (
      vehiculosAltoRiesgo.some((m) =>
        modelo.toLowerCase().includes(m.toLowerCase()),
      )
    ) {
      garantias.push('Alarma');
    }

    return garantias;
  }

  async calcularCotizacionSalud(
    dto: CalcularCotizacionSaludDto,
  ): Promise<CotizacionResultDto> {
    const {
      fecha_nacimiento,
      tipo_plan,
      enfermedades_preexistentes = [],
      es_eps = false,
      tipo_familiar = 'individual',
      zona_riesgo = 'Media',
      descuento_promocional = 0,
    } = dto;

    if (!fecha_nacimiento || !tipo_plan) {
      throw new BadRequestException(
        'Fecha de nacimiento y tipo de plan son requeridos para cotizar salud',
      );
    }

    // Calcular edad
    const fechaNacimiento = new Date(fecha_nacimiento);
    const hoy = new Date();
    let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
    const mesActual = hoy.getMonth();
    const mesNacimiento = fechaNacimiento.getMonth();
    if (
      mesNacimiento > mesActual ||
      (mesNacimiento === mesActual && fechaNacimiento.getDate() > hoy.getDate())
    ) {
      edad--;
    }

    if (edad < 0 || edad > 120) {
      throw new BadRequestException('Fecha de nacimiento inválida');
    }

    // Buscar plan seleccionado
    const planSeleccionado = this.planesSaludData.find(
      (plan) => plan.tipo === tipo_plan,
    );

    if (!planSeleccionado) {
      throw new BadRequestException(
        `Plan ${tipo_plan} no encontrado. Planes disponibles: basico, intermedio, premium, internacional`,
      );
    }

    // Obtener factor de edad
    const rangoEdad = this.rangosEdadSalud.find(
      (rango) => edad >= rango.edad_min && edad <= rango.edad_max,
    );

    if (!rangoEdad) {
      throw new BadRequestException('Edad fuera del rango permitido');
    }

    // Calcular prima base ajustada por edad
    let primaBase =
      planSeleccionado.precio_base_mensual * rangoEdad.factor_edad;

    // Aplicar factores de enfermedades preexistentes
    let factorEnfermedades = 1;
    for (const enfermedad of enfermedades_preexistentes) {
      const factor = this.enfermedadesPreexistentes[enfermedad.toLowerCase()];
      if (factor) {
        factorEnfermedades *= factor;
      }
    }
    primaBase *= factorEnfermedades;

    // Ajuste por zona de riesgo
    let factorZona = 1;
    if (zona_riesgo === 'Alta') factorZona = 1.2;
    else if (zona_riesgo === 'Baja') factorZona = 0.9;
    primaBase *= factorZona;

    // Ajuste por tipo familiar
    let factorFamiliar = 1;
    if (tipo_familiar === 'familiar') {
      factorFamiliar = 2.5; // Costo adicional para familia
    } else if (tipo_familiar === 'pareja') {
      factorFamiliar = 1.8;
    }
    primaBase *= factorFamiliar;

    // Descuento por EPS
    if (es_eps) {
      primaBase *= 0.85; // 15% descuento por EPS
    }

    // Aplicar descuento promocional
    if (descuento_promocional > 0 && descuento_promocional <= 50) {
      primaBase *= (100 - descuento_promocional) / 100;
    }

    // Calcular prima anual
    const primaAnual = primaBase * 12;

    // Aplicar IGV (18%)
    const primaTotalAnual = primaAnual * 1.18;

    // Calcular deducibles según el plan
    const deducibles = [planSeleccionado.deducible_anual];

    // Obtener coberturas del plan
    const coberturas = planSeleccionado.coberturas_incluidas;

    // Metadatos adicionales
    const metadata = {
      edadCalculada: edad,
      factorEdad: rangoEdad.factor_edad,
      factorEnfermedades,
      factorZona,
      factorFamiliar,
      descuentoEPS: es_eps ? 15 : 0,
      descuentoPromocional: descuento_promocional,
      primaMensual: Math.round(primaBase * 100) / 100,
      primaAnualSinIGV: Math.round(primaAnual * 100) / 100,
      planSeleccionado: {
        nombre: planSeleccionado.nombre,
        tipo: planSeleccionado.tipo,
        coberturaMaxima: planSeleccionado.cobertura_maxima,
        coaseguro: planSeleccionado.coaseguro,
        descripcion: planSeleccionado.descripcion,
      },
    };

    return {
      tipo_seguro: 'SALUD',
      prima_total: Math.round(primaTotalAnual * 100) / 100,
      prima_neta: Math.round(primaAnual * 100) / 100,
      costo_mensual: Math.round(primaBase * 100) / 100,
      costo_anual: Math.round(primaTotalAnual * 100) / 100,
      metadata: {
        edadCalculada: edad,
        factorEdad: rangoEdad.factor_edad,
        factorEnfermedades,
        factorZona,
        factorFamiliar,
        descuentoEPS: es_eps ? 15 : 0,
        descuentoPromocional: descuento_promocional,
        deducibles,
        coberturas,
        planSeleccionado: {
          nombre: planSeleccionado.nombre,
          tipo: planSeleccionado.tipo,
          coberturaMaxima: planSeleccionado.cobertura_maxima,
          coaseguro: planSeleccionado.coaseguro,
          descripcion: planSeleccionado.descripcion,
        },
      },
    };
  }

  calcularCotizacionSctr(dto: CalcularCotizacionSctrDto): CotizacionResultDto {
    // Validar que el sueldo mínimo sea al menos el SMV
    if (dto.sueldo_minimo < this.SUELDO_MINIMO_VITAL) {
      throw new BadRequestException(
        `El sueldo mínimo debe ser al menos S/ ${this.SUELDO_MINIMO_VITAL} (SMV 2024)`
      );
    }

    // Buscar la actividad económica
    const actividad = this.actividadesSctrData.find(
      act => act.codigo === dto.codigo_actividad
    );

    if (!actividad) {
      throw new BadRequestException(
        `Código de actividad ${dto.codigo_actividad} no encontrado`
      );
    }

    // Verificar si es actividad de alto riesgo
    const esAltoRiesgo = this.actividadesAltoRiesgo.includes(dto.codigo_actividad);

    if (esAltoRiesgo && !dto.evaluacion_riesgo_realizada) {
      throw new BadRequestException(
        `La actividad ${dto.codigo_actividad} (${actividad.descripcion}) es de alto riesgo. ` +
        `Se requiere evaluación de riesgo previa para calcular la cotización.`
      );
    }

    // Validar número de trabajadores
    if (dto.numero_trabajadores < 1) {
      throw new BadRequestException('El número de trabajadores debe ser al menos 1');
    }

    // Calcular planilla total mensual
    const planillaTotal = dto.numero_trabajadores * dto.sueldo_minimo;

    // Calcular prima total (planilla × tasa de actividad)
    const primaTotal = planillaTotal * actividad.tasa;

    // Aplicar porcentaje de emisión (12% promedio en Perú)
    const porcentajeEmision = 0.12;
    const primaEmision = primaTotal * porcentajeEmision;
    const primaNeta = primaTotal - primaEmision;

    // Calcular costo mensual por trabajador
    const costoMensualTrabajador = primaTotal / dto.numero_trabajadores;
    const costoAnual = primaTotal * 12;

    // Determinar nivel de riesgo
    let nivelRiesgo: string;
    if (actividad.tasa <= 0.01) nivelRiesgo = 'Muy Bajo';
    else if (actividad.tasa <= 0.02) nivelRiesgo = 'Bajo';
    else if (actividad.tasa <= 0.03) nivelRiesgo = 'Medio';
    else if (actividad.tasa <= 0.04) nivelRiesgo = 'Alto';
    else nivelRiesgo = 'Muy Alto';

    return {
      tipo_seguro: 'SCTR',
      prima_total: Math.round(primaTotal * 100) / 100,
      prima_neta: Math.round(primaNeta * 100) / 100,
      costo_mensual: Math.round(primaTotal * 100) / 100,
      costo_anual: Math.round(costoAnual * 100) / 100,
      metadata: {
        actividad_economica: {
          codigo: actividad.codigo,
          descripcion: actividad.descripcion,
          tasa: actividad.tasa,
          nivel_riesgo: nivelRiesgo,
          es_alto_riesgo: esAltoRiesgo,
        },
        planilla: {
          numero_trabajadores: dto.numero_trabajadores,
          sueldo_minimo: dto.sueldo_minimo,
          planilla_total: Math.round(planillaTotal * 100) / 100,
        },
        calculos: {
          porcentaje_emision: porcentajeEmision * 100,
          prima_emision: Math.round(primaEmision * 100) / 100,
          costo_mensual_trabajador: Math.round(costoMensualTrabajador * 100) / 100,
        },
        validaciones: {
          cumple_smv: dto.sueldo_minimo >= this.SUELDO_MINIMO_VITAL,
          evaluacion_riesgo_completa: esAltoRiesgo ? dto.evaluacion_riesgo_realizada : true,
        },
      },
    };
  }
}

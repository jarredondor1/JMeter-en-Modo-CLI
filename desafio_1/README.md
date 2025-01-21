# JMeter en Modo CLI

Repositorio destinado a la ejecución de pruebas de rendimiento utilizando Apache JMeter en modo no gráfico (Command Line Interface - CLI). Este enfoque permite optimizar el rendimiento y automatizar pruebas de manera eficiente.

---

## **Descripción del Proyecto**

Este proyecto contiene scripts y configuraciones para realizar pruebas de rendimiento a sistemas web mediante JMeter. La ejecución en modo CLI permite integrar estas pruebas en pipelines de CI/CD y reducir el consumo de recursos durante su ejecución.

---

## **Estructura del Repositorio**

---

## **Requisitos Previos**

1. **Apache JMeter instalado**
   - Versión recomendada: `5.6.3` o superior.
   - Descargar desde [Apache JMeter](https://jmeter.apache.org/).

2. **Java JDK instalado**
   - Versión mínima: `8`.
   - Verifica con:
     ```bash
     java -version
     ```

3. **Git instalado**
   - Verifica con:
     ```bash
     git --version
     ```
---

## **Instrucciones de Uso**

### **Clonar el Repositorio**
```bash
git clone https://github.com/jarredondor1/JMeter-en-Modo-CLI.git
cd JMeter-en-Modo-CLI

# Ejecutar Pruebas en Modo CLI

## 1.Navega a la carpeta del script:

cd "desafio_1"

## 2. Ejecuta el archivo JMX:

jmeter -n -t RetoPruebasPerformance.jmx -l resultados.jtl -e -o reporte3_html

-n: Modo no gráfico.
-t: Ruta del archivo .jmx.
-l: Archivo de salida con resultados en formato .jtl.
-e -o: Generar reporte HTML en la carpeta reporte3_html.

## 3. Accede al reporte:

Abre el archivo reporte3_html/index.html en tu navegador.



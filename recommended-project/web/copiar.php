<?php

// Url
$url = $_GET['url'];

// Si la url no inicia con private:// entonces no continuar
if(strpos($url, 'private://') !== 0) {
	exit();
}

// Quitar el protocolo private
$url = str_replace("private://", "", $url);

// Determinar el archivo origen
$source = dirname(__FILE__, 2) . "/pfsfiles/" . $url;

// Renombrar separardor directorios a ____
$file_dest = str_replace("/", "____", $url);

// Determinar el archivo de destino
$dest = dirname(__FILE__, 2) . "/lago/" . $file_dest;

// Directorio destino
$dir = dirname($dest);

try {
	// Archivo existe?
	if(!file_exists($source)) {
		throw new Exception("No existe archivo");
	}

	// Copiar archivo
	copy($source, $dest);
	echo "<h1>Documento copiado</h1>";
} catch(Exception $e) {
	echo "<h1>No fue posible copiar el documento</h1>";
}

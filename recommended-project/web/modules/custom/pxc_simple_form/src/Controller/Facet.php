<?php

namespace Drupal\pxc_simple_form\Controller;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;

/**
 * Defines HelloController class.
 */
class Facet extends ControllerBase {

  /**
   * Return Solr Custom Responses
   *
   * @return json
   *   Return JSON with Solr response to a query.
   */
  public function consumirServicio() {
      
    // $tid = htmlspecialchars($_GET["tid"]); 
    
    $errorCampos = 0;
    $errorCamposString = "";
    $request = Request::createFromGlobals();
    $request->getPathInfo();
    
    // 1. Recuperar los valores suministrados.
    if(gettype($request->query->get('search_api_fulltext')) == 'string') {
        $search_api_fulltext = htmlspecialchars($request->query->get('search_api_fulltext'));
    }else{
        $errorCampos++;
        $errorCamposString .= "-1";
    }
    if(gettype($request->query->get('tipo')) == 'string') {
        $tipo = htmlspecialchars($request->query->get('tipo'));
    }else{
        $errorCampos++;
        $errorCamposString .= "-2";
    }
    if(gettype($request->query->get('estatus')) == 'string') {
        $estatus = htmlspecialchars($request->query->get('estatus'));
    }else{
        $errorCampos++;
        $errorCamposString .= "-3";
    }
    if(gettype($request->query->get('autor')) == 'string') {
        $autor = htmlspecialchars($request->query->get('autor'));
    }else{
        $errorCampos++;
        $errorCamposString .= "-4";
    }
    if(gettype($request->query->get('taxonomy')) == 'string') {
        $taxonomy = htmlspecialchars($request->query->get('taxonomy'));
    }else{
        $errorCampos++;
        $errorCamposString .= "-5";
    }
    if(gettype($request->query->get('created_min')) == 'string') {
        $created_min = htmlspecialchars($request->query->get('created_min'));
    }else{
        $errorCampos++;
        $errorCamposString .= "-6";
    }
    if(gettype($request->query->get('created_max')) == 'string') {
        $created_max = htmlspecialchars($request->query->get('created_max'));
    }else{
        $errorCampos++;
        $errorCamposString .= "-7";
    }
    if(gettype($request->query->get('filename_op')) == 'string') {
        $filename_op = htmlspecialchars($request->query->get('filename_op'));
    }else{
        $errorCampos++;
        $errorCamposString .= "-8";
    }
    if(gettype($request->query->get('filename_1_op')) == 'string') {
        $filename_1_op = htmlspecialchars($request->query->get('filename_1_op'));
    }else{
        $errorCampos++;
        $errorCamposString .= "-9";
    }
    if(gettype($request->query->get('filename_2_op')) == 'string') {
        $filename_2_op = htmlspecialchars($request->query->get('filename_2_op'));
    }else{
        $errorCampos++;
        $errorCamposString .= "-10";
    }
    if(gettype($request->query->get('title_op')) == 'string') {
        $title_op = htmlspecialchars($request->query->get('title_op'));
    }else{
        $errorCampos++;
        $errorCamposString .= "-11";
    }
    
    // Si no hay errores, construya el query
    if($errorCampos === 0) {
    
        // 2. Construir el query.
        if(strlen($search_api_fulltext)>0) {
            $search_api_fulltext = strtolower($search_api_fulltext);
            $search_api_fulltext = "(tm_X3b_es_body:(%2B%22" . $search_api_fulltext . "%22)^1+tm_X3b_und_body:(%2B%22" . $search_api_fulltext . "%22)^1" . "+tm_X3b_es_field_arreglo_de_citas:(%2B%22" . $search_api_fulltext . "%22)^1" . "+tm_X3b_es_field_arreglo_de_keywords_y_enti:(%2B%22" . $search_api_fulltext . "%22)^1" . "+tm_X3b_es_field_arreglo_de_sinonimos:(%2B%22" . $search_api_fulltext . "%22)^1" . "+tm_X3b_es_field_arreglo_de_resumenes:(%2B%22" . $search_api_fulltext . "%22)^1" . "+tm_X3b_es_name_1:(%2B%22" . $search_api_fulltext . "%22)^1" . ")";
        }else{
            $search_api_fulltext = "*:*";
        }
        $tipo = strtolower($tipo);
        if ($tipo == "all") {
            $tipo = "";
        }else{
            $tipo = intval($tipo);
            $tipo = "%2Bits_field_tipo_de_foam:%22". $tipo ."%22+";
        }
        $estatus = intval($estatus);
        if($estatus == 1) {
            $estatus = "%2Bbs_status:%22true%22";
        }
        if($estatus == 0) {
            $estatus = "%2Bbs_status:%22false%22";
        }
        if (strlen($autor) > 0) {
            //$autor = strtolower($autor);
            $autor = "%2Bss_name_4:%22". $autor ."%22+";
        }
        if (strlen($taxonomy) > 0) {
            $taxonomy = "%2Bsm_name_2:%22". $taxonomy ."%22+";
        }
        if (strlen($created_min) > 0) {
            $created_min = date("Y-m-d", strtotime($created_min));
            $created_min = "%2Bds_created:[%22". $created_min ."T00:00:00Z%22+TO+";
        }
        if (strlen($created_max) > 0) {
            $created_max = date("Y-m-d", strtotime($created_max));
            $created_max = "%22". $created_max ."T11:59:59Z%22]+";
        }
        // Criterio de búsqueda para generar si tiene o no imágenes adjuntas, o los demás tipos de medios.
        if (strlen($filename_op) > 0) {
            $filename_op = strtolower($filename_op);
            if($filename_op == "=") {
                $filename_op = "";
            }elseif($filename_op == "not empty") {
                $filename_op = "%2Bsm_filename:[*+TO+*]+";
            }else{
                $filename_op = "";
            }
        }
        if (strlen($filename_1_op) > 0) {
            $filename_1_op = strtolower($filename_1_op);
            if($filename_1_op == "=") {
                $filename_1_op = "";
            }elseif($filename_1_op == "not empty") {
                $filename_1_op = "%2Bsm_filename_1:[*+TO+*]+";
            }else{
                $filename_1_op = "";
            }
        }
        if (strlen($filename_2_op) > 0) {
            $filename_2_op = strtolower($filename_2_op);
            if($filename_2_op == "=") {
                $filename_2_op = "";
            }elseif($filename_2_op == "not empty") {
                $filename_2_op = "((%2Bsm_filename_2:[*+TO+*])OR(+%2Bsm_title:[*+TO+*]))AND+";
            }else{
                $filename_2_op = "";
            }
        }
        if (strlen($title_op) > 0) {
            $title_op = strtolower($title_op);
            if($title_op == "=") {
                $title_op = "";
            }elseif($title_op == "not empty") {
                // $title_op = "(+%2Bsm_title:[*+TO+*]+";
            }else{
                $title_op = "";
            }
        }
        
        $url = "https://useast94-new.solrcluster.com/solr/bhIndexopensolr/select?facet.field={!key%3Ditm_tid+ex%3Dfacet:tid}itm_tid&json.nl=flat&TZ=America/Bogota&fl=ss_search_api_id,ss_search_api_language,score,hash&f.itm_tid.facet.missing=false&start=0&facet.missing=false&sort=score+desc,ds_created+desc&fq=(" . $filename_2_op . $tipo . $autor . $taxonomy . $created_min . $created_max . $filename_op . $filename_1_op . $estatus . ")&fq=%2Bindex_id:bh_r2&fq=ss_search_api_language:(%22es%22+%22und%22)&f.itm_tid.facet.limit=-1&rows=100&q={!boost+b%3Dboost_document}++" . $search_api_fulltext . "&facet.limit=100&omitHeader=true&facet.mincount=1&wt=json&facet=true&facet.sort=count";
    
        // 3. Conexión y consumo del servicio.
    
        $client = \Drupal::httpClient();
        
        $auth = 'Basic b3BlblNvbHJCSFNlcnZlcjpUTktSQ1g4SjVGOUhAZmI=';
        
        try {
          $request = $client->get($url, [
            'headers' => [
                'Authorization' => $auth,
            ],
          ]);
          $status = $request->getStatusCode();
          $transfer_success = $request->getBody()->getContents();
          return new Response($transfer_success);
        }
        catch (RequestException $e) {
          console.log("Error al hacer FACETS");
          console.log($e-getMessage());
          return new Response('{"error":'.$e-getMessage().'}');
        }
    
    }else{
        return new Response('{"error":"Campos faltantes", "cuales":"'.$errorCamposString.'"}');
    }
  }
  
    /**
   * Return Solr autocomplete autores
   *
   * @return json
   *   Return JSON with Solr response to a query.
   */
  public function autocompletarAutores() {
      
    $errorCampos = 0;
    $request = Request::createFromGlobals();
    $request->getPathInfo();
    
    // 1. Recuperar los valores suministrados.
    if(gettype($request->query->get('q')) == 'string') {
        $q = htmlspecialchars($request->query->get('q'));
    }else{
        $errorCampos++;
    }
    
    if($errorCampos == 0) {
        
        // 2. Conexión y consumo del servicio.
        $url = "https://useast94-new.solrcluster.com/solr/bhIndexopensolr/suggest?suggest=true&suggest.dictionary=autores&suggest.q=" . $q;
        
        $client = \Drupal::httpClient();
            
        $auth = 'Basic b3BlblNvbHJCSFNlcnZlcjpUTktSQ1g4SjVGOUhAZmI=';
            
        try {
              $request = $client->get($url, [
                'headers' => [
                    'Authorization' => $auth,
                ],
              ]);
              $status = $request->getStatusCode();
              $transfer_success = $request->getBody()->getContents();
              return new Response($transfer_success);
        }
        catch (RequestException $e) {
            console.log("Error al hacer AUTORES");
            console.log($e-getMessage());
            return new Response('{"error":'.$e-getMessage().'}');
        }
    }else{
        return new Response('{"error":"Campos faltantes"}');
    }
      
  }
  
    /**
   * Return Solr autocomplete temas
   *
   * @return json
   *   Return JSON with Solr response to a query.
   */
  public function autocompletarTemas() {
      
    $errorCampos = 0;
    $request = Request::createFromGlobals();
    $request->getPathInfo();
    
    // 1. Recuperar los valores suministrados.
    if(gettype($request->query->get('q')) == 'string') {
        $q = htmlspecialchars($request->query->get('q'));
    }else{
        $errorCampos++;
    }
    
    if($errorCampos == 0) {
        
        // 2. Conexión y consumo del servicio.
        $url = "https://useast94-new.solrcluster.com/solr/bhIndexopensolr/suggest?suggest=true&suggest.dictionary=taxoterms&suggest.q=" . $q;
        
        $client = \Drupal::httpClient();
            
        $auth = 'Basic b3BlblNvbHJCSFNlcnZlcjpUTktSQ1g4SjVGOUhAZmI=';
            
        try {
              $request = $client->get($url, [
                'headers' => [
                    'Authorization' => $auth,
                ],
              ]);
              $status = $request->getStatusCode();
              $transfer_success = $request->getBody()->getContents();
              return new Response($transfer_success);
        }
        catch (RequestException $e) {
              console.log("Error al hacer TEMAS");
              console.log($e-getMessage());
              return new Response('{"error":'.$e-getMessage().'}');
        }
    }else{
        return new Response('{"error":"Campos faltantes"}');
    }
      
  }  

}
<?php

namespace Drupal\pxc_simple_form\Controller;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;

/**
 * Defines HelloController class.
 */
class Taxonomy extends ControllerBase {

  /**
   * Return taxonomy lists
   *
   * @return json
   *   Return JSON with taxonomy.
   */
  public function listar() {
      
    $request = Request::createFromGlobals();
    $request->getPathInfo();
    
    if(gettype($request->query->get('tids')) == 'string' && gettype($request->query->get('sizes')) == 'string') {
        
        $tids = htmlspecialchars($request->query->get('tids'));
        $sizes = htmlspecialchars($request->query->get('sizes'));
    
        $arrayTids = explode("-", $tids);
        $arraySizes = explode("-", $sizes);
        
        $query = \Drupal::database()->select('taxonomy_term_field_data', 't');
        $query->fields('t', ['tid', 'name']);
        $query->condition('t.tid', $arrayTids, 'IN');
        $query->condition('t.langcode', 'es');
        $result = $query->execute();
        
        $respuesta = '[ ';
        
        $counter = 0;
        foreach ($result as $row) {
            $id = $row->tid;
            $name = $row->name;
            $indiceS = 0;
            $indiceSZ = 0;
            foreach ($arrayTids as $rowTids) {
                if($arrayTids[$indiceS] == $id) {
                    $indiceSZ = $indiceS;
                }
                $indiceS++;
            }
            if($counter == 0) {
                $respuesta .= '{ "id" : ' . $id . ', "label" : "'. $name .'", "size" : ' . $arraySizes[$indiceSZ] . ' }';
            }else{
                $respuesta .= ', { "id" : ' . $id . ', "label" : "'. $name .'", "size" : ' . $arraySizes[$indiceSZ] . ' }';
            }
            $counter++;
        }
        
        $respuesta .= ' ]';
          
        return new Response($respuesta);
    
    }else{
        return new Response('{"error":"Campos faltantes"}');
    }
  }
  
    /**
   * Return taxonomy relatioships
   *
   * @return json
   *   Return JSON with relationships.
   */
  public function relacionar() {
    
    $request = Request::createFromGlobals();
    $request->getPathInfo();
    
    if(gettype($request->query->get('tids')) == 'string' && gettype($request->query->get('nids')) == 'string') {

        // Taxonomys and nids returned by service
        $tids = htmlspecialchars($request->query->get('tids'));
        $nids = htmlspecialchars($request->query->get('nids'));
    
        $arrayTids = explode("-", $tids);
        $arrayNids = explode("-", $nids);
        
        $query = \Drupal::database()->select('node__field_folksonomy', 't');
        $query->fields('t', ['entity_id', 'field_folksonomy_target_id']);
        $query->condition('t.field_folksonomy_target_id', $arrayTids, 'IN');
        $query->condition('t.entity_id', $arrayNids, 'IN');
        $query->condition('t.langcode', 'es');
        $query->orderBy('t.field_folksonomy_target_id', 'ASC');
        $result = $query->execute();
        
        $respuesta = '[ ';
        
        $counter = 0;
        foreach ($result as $row) {
            $tid = $row->field_folksonomy_target_id;
            $nid = $row->entity_id;
            if($counter == 0) {
                $respuesta .= '{ "tid" : ' . $tid . ', "nid" : "'. $nid .'" }';
            }else{
                $respuesta .= ', { "tid" : ' . $tid . ', "nid" : "'. $nid .'" }';
            }
            $counter++;
        }
        
        $respuesta .= ' ]';
          
        return new Response($respuesta);        
    
    }else{
        return new Response('{"error":"Campos faltantes"}');
    }
      
  }

}
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Usuario;
use DB;
use Exception;
use Validator;
use App\User;

class UsuariosController extends Controller
{
    protected $result       = false;
    protected $message      = 'Ocurrió un problema al procesar su solicitud';
    protected $records      = Array();
    protected $status_code  = 200;

    public function index()
    {
        try {
            $records = Usuario::all();
            $this->status_code  = 200;
            $this->result       = true;
            $this->message      = 'Datos consultados correctamente';
            $this->records      = $records;
        } catch (Exception $e) {
            $this->status_code  = 200;
            $this->result       = false;
            $this->message      = env('APP_DEBUG') ? $e->getMessage() : $this->message;
        } finally {
            $response = [
                'result'    =>  $this->result,
                'message'   =>  $this->message,
                'records'   =>  $this->records
            ];
            return response()->json($response, $this->status_code);
        }
    }

    public function store(Request $request)
    {
        try
        {
            $usuario = User::first(); 
            if ($request->input('token') == $usuario->remember_token) {
                $validator = $this->rules($request);
                if($validator->fails())
                {
                    $this->result   = false;
                    $this->message  = $validator->messages()->first();
                }
                else
                {
                    $this->records  = Usuario::create($request->all());
                    if ($this->records) {
                        $this->result   = true;
                        $this->message  = "Registro creado exitosamente";
                    } else {
                        $this->message  = 'El registro no pudo ser creado';
                        $this->result   = false;
                    }  
                } 
            }
            else{
                throw new \Exception('Token invalido.');
            }          
        }
        catch(Exception $e)
        {
            $this->status_code  = 200;
            $this->result       = false;
            $this->message      = env('APP_DEBUG') ? $e->getMessage() : $this->message;
        }
        finally
        {
            $response = [
                'result'    =>  $this->result,
                'message'   =>  $this->message,
                'records'   =>  $this->records
            ];
            return response()->json($response, $this->status_code);
        }
    }

    public function show($id)
    {
        try
        {
            $record = Usuario::find($id);
            if($record)
            {
                $this->records  = $record;
                $this->message  = 'Registro consultado correctamente';
                $this->result   = true;
            }
            else
            {
                $this->message  = 'El registro no existe';
                $this->result   = false;
            }
            
        }
        catch(Exception $e)
        {
            $this->status_code  = 200;
            $this->result       = false;
            $this->message      = env('APP_DEBUG') ? $e->getMessage() : $this->message;
        }
        finally
        {
            $response = [
                'result'    =>  $this->result,
                'message'   =>  $this->message,
                'records'   =>  $this->records
            ];
            return response()->json($response, $this->status_code);
        }
    }

    public function update($id, Request $request)
    {
        try
        {
            $record       = Usuario::find($id);
            if ($record) {
                $request->merge([
                    'id' => $id
                ]);
                $validator = $this->rules($request);
                if($validator->fails())
                {
                    $this->result  = false;
                    $this->message = $validator->messages()->first();
                }
                else
                {
                    $record->update($request->all());
                    $record->save();
                    $this->records  = $record;
                    $this->result   = true;
                    $this->message  = "Registro actualizado correctamente";
                }
            } else {
                $this->result = false;
                $this->message = "El registro no existe";
            }
        }
        catch(Exception $e)
        {
            $this->status_code  = 200;
            $this->result       = false;
            $this->message      = env('APP_DEBUG') ? $e->getMessage() : $this->message;
        }
        finally
        {
            $response = [
                'result'    =>  $this->result,
                'message'   =>  $this->message,
                'records'   =>  $this->records
            ];
            return response()->json($response, $this->status_code);
        }
    }

    public function destroy($id)
    {
        try
        {
            $record = Usuario::find($id);
            if($record)
            {
                $this->result = $record->delete();
                $this->message = "Registro eliminado correctamente";
            }
            else
            {
                $this->result = false;
                $this->message = "El registro no existe";
            }
        }
        catch(Exception $e)
        {
            $this->status_code  = 200;
            $this->result       = false;
            $this->message      = env('APP_DEBUG') ? $e->getMessage() : $this->message;
        }
        finally
        {
            $response = [
                'result'    =>  $this->result,
                'message'   =>  $this->message,
                'records'   =>  $this->records
            ];
            return response()->json($response, $this->status_code);
        }
    }
    
    private function rules($request)
    {
        switch ($request->method())
        {
            case 'GET' :
            case 'POST' :
            {
                return Validator::make($request->all(), [
                    'nombre'     	 => 'required|unique:usuarios,nombre',
                    'direccion'      => 'required',
                    'telefono'       => 'required'
                ]);
            }
            case 'PUT' :
            {
               return Validator::make($request->all(), [
                    'nombre'     	 => 'required|unique:usuarios,nombre,'.$request->id,
                    'direccion'      => 'required',
                    'telefono'       => 'required'
                ]);
            }
            case 'PATCH' :
            case 'DELETE' :
            default: break;
        }
    }

}

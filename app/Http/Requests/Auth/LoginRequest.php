<?php

namespace App\Http\Requests\Auth;

use Illuminate\Http\JsonResponse;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Validation\ValidationException;

class LoginRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'email'     => 'required',
            'password' => 'required'
        ];
    }

    public function messages(){
        return [
            'email.required'     => 'El nike es requerido',
            'password.required' => 'El password es requerido'
        ];
    }

    /**
     * @param Validator $validator
     * @return ValidationException
     * @throws ValidationException
     */
    protected function failedValidation(Validator $validator): ValidationException
    {
        $response = new JsonResponse([
            'status' => 'error',
            'message' => $validator->errors()
        ], 422);
        throw new ValidationException($validator, $response);
    }
}

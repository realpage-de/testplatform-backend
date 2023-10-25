<?php
namespace Users\Model\Table;

use Cake\ORM\Table;
use Cake\Validation\Validator;

class GendersTable extends Table
{

    public function initialize(array $config): void
    {
        $this->setTable('genders');
    }

    public function validationDefault(Validator $validator): Validator
    {
        return $validator;
    }
}
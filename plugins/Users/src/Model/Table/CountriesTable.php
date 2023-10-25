<?php
namespace Users\Model\Table;

use Cake\ORM\Table;
use Cake\Validation\Validator;

class CountriesTable extends Table
{

    public function initialize(array $config): void
    {
        $this->setTable('countries');
    }

    public function validationDefault(Validator $validator): Validator
    {
        return $validator;
    }
}
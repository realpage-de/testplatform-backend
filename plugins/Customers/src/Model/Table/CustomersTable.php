<?php
namespace Customers\Model\Table;

use Cake\ORM\Table;
use Cake\Validation\Validator;

class CustomersTable extends Table
{

    public function initialize(array $config): void
    {
        $this->setTable('customers');
    }

    public function validationDefault(Validator $validator): Validator
    {
        $validator
		    ->notEmptyString('status', locale('Status muss angegeben werden'))
            ->boolean('status', locale('Status muss 1 oder 0 sein'));

        $validator
            ->requirePresence('name', 'create')
            ->notEmptyString('name', 'Feld muss ausgefüllt sein')
            ->add('name', 'maxLength', [
                'rule' => ['maxLength', 50],
                'message' => 'Maximal 50 Zeichen'
            ])
			->add('name', 'unique', [
				'rule' => ['validateUnique'],
				'provider' => 'table',
				'message' => 'Kunde existiert bereits'
            ]);

        $validator
            ->notEmptyString('logo', 'Feld muss ausgefüllt sein')
            ->add('logo', 'maxLength', [
                'rule' => ['maxLength', 250],
                'message' => 'Maximal 250 Zeichen'
            ]);

        $validator
            ->add('website', 'maxLength', [
                'rule' => ['maxLength', 250],
                'message' => 'Maximal 250 Zeichen'
            ]);

        return $validator;
    }
}
<?php
namespace Users\Model\Table;

use Cake\ORM\Table;
use Cake\Validation\Validator;
use Cake\ORM\TableRegistry;
use Cake\Datasource\Exception\RecordNotFoundException;

class ProfilesTable extends Table
{

    public function initialize(array $config): void
    {
        $this->setTable('users_profile');

        $this->belongsTo('Gender', [
            'className' => 'Users.Genders',
            'foreignKey' => 'gender_id'
        ]);

        $this->belongsTo('Country', [
            'className' => 'Users.Countries',
            'foreignKey' => 'country_id'
		]);
    }

    public function validationDefault(Validator $validator): Validator
    {
		$validator
            ->notEmptyString('user_id', 'Feld muss ausgefüllt sein')
            ->add('user_id', '_valid', [
                'rule' => function($value) {
                    try {
                        TableRegistry::getTableLocator()->get('Users.Users')->get((int)$value);
                        $status = true;
                    } catch (RecordNotFoundException $exception) {
                        $status = false;
                    }
                    return $status;
                },
                'message' => 'Benutzer existiert nicht'
            ]);

        $validator
            ->notEmptyString('gender_id', 'Feld muss ausgefüllt sein')
            ->add('gender_id', '_valid', [
                'rule' => function($value) {
                    try {
                        TableRegistry::getTableLocator()->get('Users.Genders')->get((int)$value);
                        $status = true;
                    } catch (RecordNotFoundException $exception) {
                        $status = false;
                    }
                    return $status;
                },
                'message' => 'Geschlecht existiert nicht'
            ]);

        $validator
            ->requirePresence('first_name', 'create')
            ->notEmptyString('first_name', 'Feld muss ausgefüllt sein')
            ->add('first_name', 'maxLength', [
                'rule' => ['maxLength', 50],
                'message' => 'Maximal 50 Zeichen'
            ]);

        $validator
            ->requirePresence('last_name', 'create')
            ->notEmptyString('last_name', 'Feld muss ausgefüllt sein')
            ->add('last_name', 'maxLength', [
                'rule' => ['maxLength', 50],
                'message' => 'Maximal 50 Zeichen'
            ]);

        $validator
            ->requirePresence('street', 'create')
            ->notEmptyString('street', 'Feld muss ausgefüllt sein')
            ->add('street', 'maxLength', [
                'rule' => ['maxLength', 50],
                'message' => 'Maximal 50 Zeichen'
            ]);

        $validator
            ->requirePresence('street_number', 'create')
            ->notEmptyString('street_number', 'Feld muss ausgefüllt sein')
            ->add('street_number', 'maxLength', [
                'rule' => ['maxLength', 10],
                'message' => 'Maximal 10 Zeichen'
            ]);

        $validator
            ->requirePresence('zip', 'create')
            ->notEmptyString('zip', 'Feld muss ausgefüllt sein')
            ->add('zip', 'maxLength', [
                'rule' => ['maxLength', 10],
                'message' => 'Maximal 10 Zeichen'
			])
			->numeric('zip', 'Darf muss aus Ziffern bestehen');

        $validator
            ->requirePresence('city', 'create')
            ->notEmptyString('city', 'Feld muss ausgefüllt sein')
            ->add('city', 'maxLength', [
                'rule' => ['maxLength', 50],
                'message' => 'Maximal 50 Zeichen'
            ]);

		$validator
            ->notEmptyString('country_id', 'Feld muss ausgefüllt sein')
            ->add('country_id', '_valid', [
                'rule' => function($value) {
                    try {
                        TableRegistry::getTableLocator()->get('Users.Countries')->get((int)$value);
                        $status = true;
                    } catch (RecordNotFoundException $exception) {
                        $status = false;
                    }
                    return $status;
                },
                'message' => 'Land existiert nicht'
            ]);

		$validator
            ->requirePresence('date_of_birth', 'create')
            ->notEmptyString('date_of_birth', 'Feld muss ausgefüllt sein');

        return $validator;
    }
}
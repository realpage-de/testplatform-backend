<?php
namespace Users\Model\Table;

use Cake\ORM\Table;
use Cake\Validation\Validator;
use Cake\ORM\TableRegistry;

class ChildrenTable extends Table
{

    public function initialize(array $config): void
    {
        $this->setTable('users_children');
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
            ->requirePresence('date_of_birth_year', 'create')
            ->notEmptyString('date_of_birth_year', 'Feld muss ausgefüllt sein')
            ->add('date_of_birth_year', 'maxLength', [
                'rule' => ['maxLength', 4],
                'message' => 'Maximal 4 Zeichen'
			])
            ->numeric('date_of_birth_year', 'Darf muss aus Ziffern bestehen')
            ->add('date_of_birth_year', '_valid', [
                'rule' => function($value) {
                    return ((int)$value >= 1950 && (int)$value <= date('Y'));
                },
                'message' => 'Ungültige Angabe'
            ]);

        $validator
            ->requirePresence('date_of_birth_month', 'create')
            ->notEmptyString('date_of_birth_month', 'Feld muss ausgefüllt sein')
            ->add('date_of_birth_month', 'maxLength', [
                'rule' => ['maxLength', 2],
                'message' => 'Maximal 2 Zeichen'
			])
            ->numeric('date_of_birth_month', 'Darf muss aus Ziffern bestehen')
            ->add('date_of_birth_month', '_valid', [
                'rule' => function($value) {
                    return ((int)$value >= 1 && (int)$value <= 12);
                },
                'message' => 'Ungültige Angabe'
            ]);
        return $validator;
    }
}
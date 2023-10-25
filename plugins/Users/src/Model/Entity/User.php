<?php
namespace Users\Model\Entity;

use Cake\ORM\Entity;
use Exception;

class User extends Entity
{

    public function getChildrenAsArray()
    {
        $array = [];
        $children = $this->get('children');
        foreach ($children as $child) {
            $array[] = $child->toArray();
        }
        return $array;
    }
}
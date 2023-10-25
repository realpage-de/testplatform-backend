<?php
namespace Editor\Database\Type;

use Cake\Database\DriverInterface;
use Cake\Database\Type\BaseType;
use PDO;

class EditorType extends BaseType
{

    public function toPHP($value, DriverInterface $driver)
    {
        return is_json($value) ? json_decode($value, true) : $value;
    }

    public function marshal($value)
    {
        return $value;
    }

    public function toDatabase($value, DriverInterface $driver): ?string
    {
        return $value;
    }

    public function toStatement($value, DriverInterface $driver): int
    {
        return PDO::PARAM_STR;
    }

}
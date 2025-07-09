<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Department;
use Inertia\Inertia;
use App\Http\Requests\DepartmentRequest; 

class DepartmentController extends Controller
{
    public function index()
    {
        $departments = Department::all();

        return Inertia::render('departments/index', compact('departments'));
    }

    public function create()
    {
        return Inertia::render('departments/create', []);
    }

    public function store(DepartmentRequest $request)
    {
        $data = $request->validated();

       Department::create($data);

        return redirect()->route('departments.index')->with('message', 'Department created successfully.');
    }

    public function edit(Department $department)
    {
        return Inertia::render('departments/edit', compact('department')); 
    }

    public function update(DepartmentRequest $request, Department $department)
    {
        $data = $request->validated();

        $department->update($data);

        return redirect()->route('departments.index')->with('message', 'Department updated successfully.');
    }

    public function destroy(Department $department)
    {
        $department->delete();

        return redirect()->route('departments.index')->with('message', 'Department deleted successfully.');
    }
}

<?php

namespace App\Http\Controllers;

use App\Http\Requests\VenueRequest;
use Illuminate\Http\Request;
use App\Models\Venue;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class VenueController extends Controller
{
    public function index()
    {
        $venues = Venue::all();

        return Inertia::render('venues/index', compact('venues'));
    }

    public function create()
    {
        return Inertia::render('venues/create', []);
    }

    public function store(VenueRequest $request)
    {
        $data = $request->validated();

        if (isset($data['photo']) && $data['photo'] instanceof UploadedFile) {
            $data['photo'] = $this->uploadPhoto($data['photo']);
        }

        if (isset($data['floor_plan']) && $data['floor_plan'] instanceof UploadedFile) {
            $data['floor_plan'] = $this->uploadFloorPlan($data['floor_plan']);
        }

        Venue::create($data);

        return redirect()->route('venues.index')->with('message', 'Venue created successfully.');
    }

    public function edit(Venue $venue)
    {
        return Inertia::render('venues/edit', compact('venue')); 
    }

    public function update(VenueRequest $request, Venue $venue)
    {
        $data = $request->validated();

        if (isset($data['photo']) && $data['photo'] instanceof UploadedFile) {
            if (!empty($venue->photo)) {
                $this->deletePhoto($venue->photo);
            }
            $data['photo'] = $this->uploadPhoto($data['photo']);
        }

        if (isset($data['floor_plan']) && $data['floor_plan'] instanceof UploadedFile) {
            if (!empty($venue->floor_plan)) {
                $this->deleteFloorPlan($venue->floor_plan);
            }
            $data['floor_plan'] = $this->uploadFloorPlan($data['floor_plan']);
        }

        $venue->update($data);

        return redirect()->route('venues.index')->with('message', 'Venue updated successfully.');
    }

    public function destroy(Venue $venue)
    {
        if ($venue->photo) {
            $this->deletePhoto($venue->photo);
        }

        if ($venue->floor_plan) {
            $this->deleteFloorPlan($venue->floor_plan);
        }

        $venue->delete();

        return redirect()->route('venues.index')->with('message', 'Venue deleted successfully.');
    }

    private function uploadPhoto(UploadedFile $photo): string
    {
        return $photo->store('venues/photo', 'public');
    }

    private function uploadFloorPlan(UploadedFile $photo): string
    {
        return $photo->store('venues/floor_plan', 'public');
    }

    private function deletePhoto(string $photoPath)
    {
        $relaltivePath = 'venues/photo/' . basename($photoPath);
        if (Storage::disk('public')->exists($relaltivePath)) {
            Storage::disk('public')->delete($relaltivePath);
        }
    }

    private function deleteFloorPlan(string $photoPath)
    {
        $relaltivePath = 'venues/floor_plan/' . basename($photoPath);
        if (Storage::disk('public')->exists($relaltivePath)) {
            Storage::disk('public')->delete($relaltivePath);
        }
    }

}

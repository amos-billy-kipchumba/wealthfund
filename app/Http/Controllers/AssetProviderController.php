<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAssetProviderRequest;
use App\Http\Requests\UpdateAssetProviderRequest;
use App\Models\AssetProvider;
use Inertia\Inertia;
use Illuminate\Http\Request;

class AssetProviderController extends Controller
{

    public function index()
    {

        $assetProviders = AssetProvider::paginate(10);

        return Inertia::render('AssetProviders/Index', [
            'assetProviders' => $assetProviders->items(),
            'pagination' => $assetProviders,
            'flash' => session('flash'),
        ]);
    }

    public function create()
    {
        $assetProviders = AssetProvider::all();

        return Inertia::render('AssetProviders/Create', [
            'assetProviders' => $assetProviders,
        ]);
    }

    public function store(StoreAssetProviderRequest $request)
    {
        AssetProvider::create($request->validated());

        return redirect()->route('assetProviders.index')->with('success', 'asset provider created successfully.');
    }


    public function show(AssetProvider $assetProvider)
    {
        return Inertia::render('AssetProviders/Show', [
            'assetProvider' => $assetProvider,
        ]);
    }

    public function edit(AssetProvider $assetProvider)
    {
        $assetProviders = AssetProvider::all();

        return Inertia::render('AssetProviders/Edit', [
            'assetProvider' => $assetProvider,
            'assetProviders' => $assetProviders,
        ]);
    }

    public function update(UpdateAssetProviderRequest $request, AssetProvider $assetProvider)
    {
        $assetProvider->update($request->validated());

        return redirect()->route('assetProviders.index')->with('success', 'asset provider updated successfully.');
    }


    public function destroy(AssetProvider $assetProvider)
    {
        $assetProvider->delete();

        return redirect()->route('assetProviders.index')->with('success', 'asset provider deleted successfully.');
    }
}

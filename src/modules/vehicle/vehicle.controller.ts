import { Request, Response } from "express";
import vehicleService from "./vehicle.service";

const createVehicle = async (req: Request, res: Response) => {
    try {
        const result = await vehicleService.createVehicle(req.body);
        res.status(201).json({
            success: true,
            message: "Vehicle created successfully",
            data: result
        });
    } catch (error: any) {
        console.error('Error creating vehicle:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to create vehicle',
            errors: error
        });
    }
};

const getAllVehicles = async (req: Request, res: Response) => {
    try {
        const result = await vehicleService.getAllVehicles();
        if (!result || result.length === 0) {
            res.status(200).json({
                success: true,
                message: "No vehicles found",
                data: []
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Vehicles retrieved successfully",
            data: result
        });
    } catch (error: any) {
        console.error('Error fetching vehicles:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve vehicles',
            errors: error
        });
    }
};

const getVehicleById = async (req: Request, res: Response) => {
    try {
        const { vehicleId } = req.params as { vehicleId: string };
        const result = await vehicleService.getVehicleById(vehicleId);
        if (!result) {
            res.status(404).json({
                success: false,
                message: "Vehicle not found",
                data: null
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Vehicle retrieved successfully",
            data: result
        });
    } catch (error: any) {
        console.error('Error fetching vehicle:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve vehicle',
            errors: error
        });
    }
};

const updateVehicle = async (req: Request, res: Response) => {
    try {
        const { vehicleId } = req.params as { vehicleId: string };
        const result = await vehicleService.updateVehicle(vehicleId, req.body);
        if (!result) {
            res.status(404).json({
                success: false,
                message: "Vehicle not found or no changes applied",
                data: null
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Vehicle updated successfully",
            data: result
        });
    } catch (error: any) {
        console.error('Error updating vehicle:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update vehicle',
            errors: error
        });
    }
};

const deleteVehicle = async (req: Request, res: Response) => {
    try {
        const { vehicleId } = req.params as { vehicleId: string };
        const result = await vehicleService.deleteVehicle(vehicleId);
        if (!result) {
            res.status(404).json({
                success: false,
                message: "Vehicle not found",
                data: null
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Vehicle deleted successfully"
        });
    } catch (error: any) {
        console.error('Error deleting vehicle:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to delete vehicle',
            errors: error
        });
    }
};

const vehicleController = {
    createVehicle,
    getAllVehicles,
    getVehicleById,
    updateVehicle,
    deleteVehicle
};

export default vehicleController;

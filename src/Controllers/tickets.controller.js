const { Tickets } = require("../Models/tickets.model");
const { HTTP_STATUS_CODE, MESSAGE, RESPONSE_TITLES } = require("../utilities/constants.utils");
const { TicketsValidator } = require("../validators/schema.validator");

exports.add = async (req, res, next) => {
    try {
        const validatedData = await TicketsValidator.validateAsync({ ...req.body });
        const tickets = await Tickets.create(validatedData);
        return res.status(HTTP_STATUS_CODE.CREATED).json({ status: HTTP_STATUS_CODE.CREATED, message: MESSAGE.USER_REGISTERED_SUCCESSFULLY, success: true, data: { tickets } });
    } catch (error) {
        console.log("Error occurred ", error);
        res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({ code: HTTP_STATUS_CODE.BAD_REQUEST, status: RESPONSE_TITLES.ERROR, message: MESSAGE.USER_NOT_FOUND, data: null, error });
        next(error);
    }
};

exports.getOne = async (req, res, next) => {
    try {
        const { id } = req.params;
        const results = await Tickets.findOne({ _id: id });
        return res.status(HTTP_STATUS_CODE.OK).json({ status: HTTP_STATUS_CODE.OK, message: MESSAGE.RESPONSE_SUCCESS, success: true, data: results });
    } catch (error) {
        res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({ code: HTTP_STATUS_CODE.BAD_REQUEST, status: RESPONSE_TITLES.ERROR, message: MESSAGE.BAD_REQUEST, data: null, error });
        next(error);
    }
};

exports.getAll = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, user_type, id, organization } = req.query;
        const offset = (page - 1) * limit;
        const countQuery = Tickets.countDocuments({});
        let query;
        if (user_type === "super_admin")
        query = Tickets.find({}).populate("associated_to").skip(offset).limit(limit);
        else if (user_type === "organization" || user_type === "org_admin")
        query = Tickets.find({ organization }).populate("associated_to").skip(offset).limit(limit);
        else if (user_type === "user")
        query = Tickets.find({ associated_to: id }).populate("associated_to").skip(offset).limit(limit);
        const [results, totalItems] = await Promise.all([
            query.exec(),
            countQuery.exec(),
        ]);
        console.log("organization", results);
        const totalPages = Math.ceil(totalItems / limit);

        return res.status(HTTP_STATUS_CODE.OK).json({
            status: HTTP_STATUS_CODE.OK, message: MESSAGE.RESPONSE_SUCCESS, success: true, data: {
                results,
                totalItems,
                totalPages,
                currentPage: page,
            }
        });
    } catch (error) {
        res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({ code: HTTP_STATUS_CODE.BAD_REQUEST, status: RESPONSE_TITLES.ERROR, message: MESSAGE.BAD_REQUEST, data: null, error });
        next(error);
    }
};

exports.getAllWithRole = async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const { role } = req.params;
        const offset = (page - 1) * limit;
        const countQuery = Tickets.countDocuments({});
        const query = Tickets.find({}).populate("raised_by").skip(offset).limit(limit);
        const [results, totalItems] = await Promise.all([
            query.exec(),
            countQuery.exec(),
        ]);
        const totalPages = Math.ceil(totalItems / limit);

        return res.status(HTTP_STATUS_CODE.OK).json({
            status: HTTP_STATUS_CODE.OK, message: MESSAGE.RESPONSE_SUCCESS, success: true, data: {
                results,
                totalItems,
                totalPages,
                currentPage: page,
            }
        });
    } catch (error) {
        res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({ code: HTTP_STATUS_CODE.BAD_REQUEST, status: RESPONSE_TITLES.ERROR, message: MESSAGE.BAD_REQUEST, data: null, error });
        next(error);
    }
};

exports.remove = async (req, res, next) => {
    try {
        const { id } = req.params;
        const results = await Tickets.deleteOne({ _id: id });
        return res.status(HTTP_STATUS_CODE.DELETE_SUCCESS).json({ status: HTTP_STATUS_CODE.DELETE_SUCCESS, message: MESSAGE.DELETE_SUCCESS, success: true, data: results });
    } catch (error) {
        res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({ code: HTTP_STATUS_CODE.BAD_REQUEST, status: RESPONSE_TITLES.ERROR, message: MESSAGE.BAD_REQUEST, data: null, error });
        next(error);
    }
};

exports.update = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updateFields = req.body;

        const updatedUser = await Tickets.findByIdAndUpdate(
            id,
            { $set: updateFields },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(HTTP_STATUS_CODE.NOT_FOUND).json({ status: HTTP_STATUS_CODE.NOT_FOUND, message: MESSAGE.USER_NOT_FOUND, success: false, data: null });
        }
        return res.status(HTTP_STATUS_CODE.OK).json({ status: HTTP_STATUS_CODE.OK, message: MESSAGE.DATA_UPDATED, success: true, data: updatedUser });
    } catch (error) {
        res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({ code: HTTP_STATUS_CODE.BAD_REQUEST, status: RESPONSE_TITLES.ERROR, message: MESSAGE.BAD_REQUEST, data: null, error });
        next(error);
    }
};
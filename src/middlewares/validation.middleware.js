import { body, validationResult } from "express-validator";


const validateRequest = async (req, res, next) => {
    // validate data
    // Using Express validator
    // 1. setup rules for validation
    const rules = [
        body('name').notEmpty().withMessage("Name is required"),
        body('price').isFloat({ gt: 0 }).withMessage("Price should be possitive value"),
        body('imageUrl').custom((value,{req})=>{
            if(!req.file){
                throw new Error('Image is required');
            }
            return true;
        })
    ];
    // 2. run those rules
    await Promise.all(rules.map(rule=> rule.run(req)));

    // 3. check if there are any errors after running the rules.
    var validationErrors=validationResult(req);

    // const { name, price, imageUrl } = req.body;
    // let errors = [];
    // if (!name || name.trim() == '') {
    //     errors.push('Name is required');
    // }
    // if (!price || parseFloat(price) < 1) {
    //     errors.push(
    //         'Price must be a positive value'
    //     );
    // }
    // try {
    //     const validUrl = new URL(imageUrl);
    // } catch (err) {
    //     errors.push('URL is invalid');
    // }

    if (!validationErrors.isEmpty()) {
        return res.render('new-product', {
            errorMessage: validationErrors.array()[0].msg,
        });
    }
    next();
}

export default validateRequest;
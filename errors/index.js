let errors =
      {
        /* System -------------------------------------------------- */
        unknownError   : `Something was unexpected.`,
        apiFail        : `The SD API fail.`,
        notAllowed     : `User is not allowed to do that.`,

        /* AUTH ---------------------------------------------------- */
        loginFail  : `Login credentials are incorrect.`,
        signupFail : `Signup data is incorrect.`,

        emailNotFound : `User email not found.`,

        fbAlreadyExists   : `Facebook ID already in use.`,
        userAlreadyExists : `User email already in use.`,

        invalidUrl : `Url is malformed or invalid.`,

        /* Validation ---------------------------------------------- */
        schemaValidation : `Invalid object`,

        /* Requests ------------------------------------------------ */
        noOptionsSelectedForZipGeneration : `An option must be selected to generate the zip correctly.`,
        entityTooLarge                    : `The request entity is too large.`,
        extraAccountFeatures              : `Can not add features to the account.`,
        accountAlreadyExists              : `The account already exists.`,
        statusAlreadyExists               : `The status already exists.`,
        siteNotFound                      : `Site not Found.`,
        userNotFound                      : `User not found.`,
        avatarNotFound                    : `Avatar not found.`,
        commentNotFound             : `Comment not found.`,
        applicationNotFound               : `Application not found.`,
        permitCreationTokenNotFound : `Permit creation token not found.`,
        cannotCreateSite                  : `The site already exists.`,
        cannotUndoDelete                  : `Can not undo the delete of this reminder.`,
        cannotDeleteRootSite              : `Can not delete the root site.`,
        cannotDeleteCurrentSite           : `Can not delete the site you are currently using.`,
        cannotRenewApplication            : `Can not renew the application, an error occurred.`,
        cannotRemoveAccessFromCurrentUser : `Can not remove access from current user.`,
        invalidApiCredentials             : `API credential with name $1 is invalid.`,
        invalidCSV                        : `Invalid CSV`,
        invalidLandingSize                : `invalidLandingSize.`,
        invalidLogoSize                   : `Invalid logo file size.`,
        invalidImageSize                  : `Invalid image size.`,
        invalidLandingDimensions          : `Invalid landing image dimensions.`,
        invalidLogoDimensions             : `Invalid logo image dimensions.`,
        invalidImageDimensions            : `Invalid image dimensions.`,
        invalidLandingFileExtension       : `Invalid landing file extension.`,
        invalidLogoFileExtension          : `Invalid logo file extension.`,
        invalidImageFileExtension         : `Invalid image extension.`,
        invalidEmail                      : `Invalid email format.`,
        invalidPhoneNumber                : `Invalid phone number.`,
        invalidPassword                   : `Invalid password.`,
        missingParameterMessage       : `Missing parameter: message.`,
        missingAccountFeatures        : `Cannot remove features from the account.`,
        missingParameterApplicationId : `Missing parameter: applicationId.`,
        missingParameterEmails        : `Missing parameter: emails.`,
        missingParameterVisitors  : `Missing parameter: visitors.`,
        missingParameterTags      : `Missing parameter: tags.`,
        missingParameterDueDate   : `Missing parameter: dueDate.`,
        missingParameterUsers     : `Missing parameter: users.`,
        missingParameterAddresses : `Missing parameter: addresses.`,
        missingParameterName      : `Missing parameter: name.`,
        groupAlreadyExists        : `The group name has already been used.`,

        /* Cost ----------------------------------------------------- */
        invalidCost       : `Invalid cost. Must be a numeric value greater than 0.`,
        invalidCostRange  : `Invalid cost range. Must be greater than the starting value.`,
        costValueRequired : `To set a range you have to put a starting value.`

      }

export {errors}
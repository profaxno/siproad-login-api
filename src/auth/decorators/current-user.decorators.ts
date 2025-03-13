// import { createParamDecorator, ExecutionContext, ForbiddenException, InternalServerErrorException } from "@nestjs/common";
// import { GqlExecutionContext } from "@nestjs/graphql";
// import { AdminUserType } from "src/admin/dto/types";
// import { PermissionsEnum } from "src/admin/enums/permissions.enum";

// export const CurrentUser = createParamDecorator( (validPermissionList: PermissionsEnum[] = [], context: ExecutionContext) => {
//   const ctx = GqlExecutionContext.create(context);
//   const user: AdminUserType = ctx.getContext().req.user;

//   if(!user){
//     throw new InternalServerErrorException(`no user inside the request - make sure that we used the AuthGuard`);
//   }

//   if(validPermissionList.length == 0)
//     return user;

//   const found = user.permissionList.find( (permission) => validPermissionList.some( (validPermission) => validPermission == permission.code ) );
//   if(found)
//     return user;

//   // TODO: ver como utilizar el logger de nest
//   // console.warn(`user need a valid role=[${JSON.stringify(validPermissionList)}]`)
//   throw new ForbiddenException('user without permissions for the resource')

// });
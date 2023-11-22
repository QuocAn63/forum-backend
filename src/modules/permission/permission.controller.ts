import { Body, Controller, Post } from "@nestjs/common";
import { PermissionService } from "./permission.service";
import { PermissionCreateDto } from "./dto/permission_create.dto";

@Controller('permission')
export class PermissionController {
    constructor(private permissionService: PermissionService) {}

    @Post()
    async createPermission(@Body() createPermissionDto: PermissionCreateDto) {
        return await this.permissionService.store(createPermissionDto)
    }
}
#[derive(Debug, Clone, Copy)]
pub struct PermissionsSet(pub u64);
pub struct ShopPermissions(pub u64);

impl PermissionsSet {
    pub const USER: u64    = 1 << 0;
    pub const CREATE_SHOP: u64  = 1 << 1;
    pub const SUPER_ADMIN: u64 = 1 << 32; 

    pub fn contains(&self, flag: u64) -> bool {
        self.0 & flag != 0
    }
}

impl ShopPermissions{
    pub const MEMBER: u64 = 1 << 0;
    pub const EDIT_PRODUCT: u64 = 1 << 1;
    pub const FINANCE: u64 = 1 << 2;
    pub const EDIT_SHOP_INFO: u64 = 1 << 3;
    pub const OWNER: u64 = 1 << 4;
}

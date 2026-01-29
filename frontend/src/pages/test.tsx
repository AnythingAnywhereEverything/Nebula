import style from '@styles/home.module.scss';
import { NextPageWithLayout } from '../types/global.d';
import { DropdownMenuTrigger, DropdownMenuContent, DropdownMenuGroup, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator, DropdownMenu, DropdownMenuPortal, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger } from '@components/ui/Nebula/dropdown-menu';
import Link from 'next/link';
import {Dialog, Button, Input, Textarea, InputGroup, InputGroupInput, InputGroupAddon, Icon, InputGroupText, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose, ButtonGroup, ButtonGroupSeparator, ProductItem, ProductImage, ProductContent, ProductHeader, ProductFooter, ProductStars, ProductLocation, ProductPrice, InputGroupButton, Label } from '@components/ui/NebulaUI';
import { Badge } from '@components/ui/Nebula/badge';
import { ProductContainer, ProductContainerDescription, ProductContainerHeader, ProductContainerHeaderAddon, ProductContainerTitle, ProductField } from '@components/ui/Nebula/product-field';
import { SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectLabel, SelectItem, Select, SelectSeparator } from '@components/ui/Nebula/selector';
import { Switch } from '@components/ui/Nebula/switch';
import { Field, FieldLabel, FieldDescription, FieldGroup, FieldLegend, FieldSet, FieldContent, FieldTitle } from '@components/ui/Nebula/field';
import { Checkbox } from '@components/ui/Nebula/checkbox';

const TestPage: NextPageWithLayout = () => {

  return (
    <div className={style.homeContainer} style={{gap: "2rem"}}>
        <h1>Hello, this is a test page, you may use your components here</h1>
        <Button variant={"default"}>TEST</Button>
        <Button variant={"oppose"}>TEST</Button>
        <Button variant={"ghost"} size={"sm"}>Test Ghost sm</Button>
        <Button variant={"link"} size={"xs"}>Test Link xs</Button>
        <Button variant={"outline"} size={"lg"}>TEST lg</Button>
        <Button variant={"destructive"}>TEST destructive</Button>
        <Input placeholder="Hello"/>

        <FieldGroup style={{width:"100%", maxWidth:"25rem"}}>
            <Field orientation="horizontal">
                <Checkbox id="terms-checkbox" name="terms-checkbox" />
                <Label htmlFor="terms-checkbox">Accept terms and conditions</Label>
            </Field>
            <Field orientation="horizontal">
                <Checkbox
                id="terms-checkbox-2"
                name="terms-checkbox-2"
                defaultChecked
                />
                <FieldContent>
                <FieldLabel htmlFor="terms-checkbox-2">
                    Accept terms and conditions
                </FieldLabel>
                <FieldDescription>
                    By clicking this checkbox, you agree to the terms.
                </FieldDescription>
                </FieldContent>
            </Field>
            <Field orientation="horizontal" data-disabled>
                <Checkbox id="toggle-checkbox" name="toggle-checkbox" disabled />
                <FieldLabel htmlFor="toggle-checkbox">Enable notifications</FieldLabel>
            </Field>
            <FieldLabel>
                <Field orientation="horizontal">
                    <Checkbox id="toggle-checkbox-2" name="toggle-checkbox-2" />
                    <FieldContent>
                        <FieldTitle>Enable notifications</FieldTitle>
                        <FieldDescription>
                        You can enable or disable notifications at any time.
                        </FieldDescription>
                    </FieldContent>
                </Field>
            </FieldLabel>
            </FieldGroup>

        <Textarea placeholder="test message"/>
        <InputGroup>
            <InputGroupInput id="inline-start-input" placeholder="Search..." />
            <InputGroupAddon align="inline-start">
            <Icon value='S'/>
            </InputGroupAddon>
        </InputGroup>
        <InputGroup>
            <InputGroupInput id="block-end-input" placeholder="Enter amount" />
            <InputGroupAddon align="block-end">
                <InputGroupText>USD</InputGroupText>
            </InputGroupAddon>
        </InputGroup>



        <DropdownMenu>
            <DropdownMenuTrigger asChild>
            <Button variant="outline">Open</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
            <DropdownMenuGroup>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
            </DropdownMenuGroup>
                <DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Team</DropdownMenuItem>
                    <DropdownMenuItem>Subscription</DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>


        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">Open</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent style={{width:"calc(var(--spacing)*40)"}} align="start">
                <DropdownMenuGroup>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuItem>
                    Profile
                    <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    Billing
                    <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    Settings
                    <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                <DropdownMenuItem>Team</DropdownMenuItem>
                <DropdownMenuSub>
                    <DropdownMenuSubTrigger>Invite users</DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                        <DropdownMenuItem>Email</DropdownMenuItem>
                        <DropdownMenuItem>Message</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>More...</DropdownMenuItem>
                    </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuItem>
                    New Team
                    <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
                </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                <DropdownMenuItem>GitHub</DropdownMenuItem>
                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuItem disabled>API</DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                <DropdownMenuItem>
                    Log out
                    <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
            </DropdownMenu>

        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Share</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Share link</DialogTitle>
                    <DialogDescription>
                        Anyone who has this link will be able to view this.
                    </DialogDescription>
                </DialogHeader>
                <div>
                    <div>
                        <label htmlFor="link">
                        Link
                        </label>
                        <Input
                            id="link"
                            defaultValue="https://youtube.com/"
                            readOnly
                        />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button">Close</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        <ButtonGroup>
            <ButtonGroup>
                <Button variant="outline" size="icon">
                    <Icon value='+' />
                </Button>
            </ButtonGroup>
            <ButtonGroup>
                <InputGroup>
                    <InputGroupAddon align="inline-end">
                        <InputGroupButton variant="ghost" size="icon-xs">
                            <Icon value='+' />
                        </InputGroupButton>
                    </InputGroupAddon>
                    <InputGroupInput placeholder="Send a message..." />
                </InputGroup>
            </ButtonGroup>
        </ButtonGroup>

        <ButtonGroup>
            <Button variant="default" size="sm">
                Copy
            </Button>
            <ButtonGroupSeparator />
            <Button variant="oppose" size="sm">
                Paste
            </Button>
        </ButtonGroup>

        <Select>
            <SelectTrigger style={{width:"100%", maxWidth:"calc(var(--spacing)*48)"}}>
                <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>
            <SelectContent position="popper">
                <SelectGroup>
                    <SelectLabel>Fruits</SelectLabel>
                    <SelectItem value="apple">Apple</SelectItem>
                    <SelectItem value="banana">Banana</SelectItem>
                    <SelectItem value="blueberry">Blueberry</SelectItem>
                    <SelectItem value="grapes">Grapes</SelectItem>
                    <SelectItem value="pineapple">Pineapple</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>

        <Select>
            <SelectTrigger className="w-full max-w-48">
                <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Fruits</SelectLabel>
                    <SelectItem value="apple">Apple</SelectItem>
                    <SelectItem value="banana">Banana</SelectItem>
                    <SelectItem value="blueberry">Blueberry</SelectItem>
                </SelectGroup>
                <SelectSeparator />
                <SelectGroup>
                    <SelectLabel>Vegetables</SelectLabel>
                    <SelectItem value="carrot">Carrot</SelectItem>
                    <SelectItem value="broccoli">Broccoli</SelectItem>
                    <SelectItem value="spinach">Spinach</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>

        <ProductItem orientation={"horizontal"}>
            <ProductImage src="https://placehold.co/400x800"/>
            <ProductContent>
                <ProductHeader asChild>
                    <Link href={"#"}>
                        <Badge color="#0f328a" size={"xs"}>Nebula Pick</Badge>
                        Some weird ass product Name, who named this?
                    </Link>
                </ProductHeader>
                <ProductFooter>
                    <ProductPrice base={50} discount={28.99}/>
                    <ProductStars stars={2.5}/>
                    <ProductLocation location='Thailand'/>
                    <Button variant={"oppose"} size={"sm"}>Hmmm</Button>
                </ProductFooter>
            </ProductContent>
        </ProductItem>

        <Switch />

            <Field style={{width:"100%", maxWidth:"calc(var(--spacing)*48)"}}>
                <FieldLabel>Department</FieldLabel>
                    <Select>
                        <SelectTrigger>
                        <SelectValue placeholder="Choose department" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectGroup>
                            <SelectItem value="engineering">Engineering</SelectItem>
                            <SelectItem value="design">Design</SelectItem>
                            <SelectItem value="marketing">Marketing</SelectItem>
                            <SelectItem value="sales">Sales</SelectItem>
                            <SelectItem value="support">Customer Support</SelectItem>
                            <SelectItem value="hr">Human Resources</SelectItem>
                            <SelectItem value="finance">Finance</SelectItem>
                            <SelectItem value="operations">Operations</SelectItem>
                        </SelectGroup>
                        </SelectContent>
                    </Select>
                <FieldDescription>
                    Select your department or area of work.
                </FieldDescription>
            </Field>

            <FieldSet style={{width:"100%", maxWidth:"20rem"}}>
                <FieldLegend>Address Information</FieldLegend>
                <FieldDescription>
                    We need your address to deliver your order.
                </FieldDescription>
                <FieldGroup>
                    <Field>
                        <FieldLabel htmlFor="street">Street Address</FieldLabel>
                        <Input id="street" type="text" placeholder="123 Main St" />
                    </Field>
                    <div style={{display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "1rem"}}>
                        <Field>
                            <FieldLabel htmlFor="city">City</FieldLabel>
                            <Input id="city" type="text" placeholder="New York" />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="zip">Postal Code</FieldLabel>
                            <Input id="zip" type="text" placeholder="90502" />
                        </Field>
                    </div>
                </FieldGroup>
            </FieldSet>

        <ProductContainer>
            <ProductContainerHeader>
                <ProductContainerTitle>
                    Showmore
                </ProductContainerTitle>
                <ProductContainerDescription>
                    Hello there
                </ProductContainerDescription>
                <ProductContainerHeaderAddon>
                    <Button variant={"ghost"}>Show more</Button>
                </ProductContainerHeaderAddon>
            </ProductContainerHeader>
            <ProductField max_rows={1}/>
        </ProductContainer>

        
    </div>
  );
};

export default TestPage;

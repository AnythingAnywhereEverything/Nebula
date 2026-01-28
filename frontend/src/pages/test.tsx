import style from '@styles/home.module.scss';
import { NextPageWithLayout } from '../types/global.d';
import { DropdownMenuTrigger, DropdownMenuContent, DropdownMenuGroup, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator, DropdownMenu } from '@components/ui/Nebula/dropdown-menu';
import Link from 'next/link';
import {Dialog, Button, Input, Textarea, InputGroup, InputGroupInput, InputGroupAddon, Icon, InputGroupText, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose, ButtonGroup, ButtonGroupSeparator, ProductItem, ProductImage, ProductContent, ProductHeader, ProductFooter, ProductStars, ProductLocation, ProductPrice } from '@components/ui/NebulaUI';
import { Badge } from '@components/ui/Nebula/badge';
import { ProductContainer, ProductContainerDescription, ProductContainerHeader, ProductContainerHeaderAddon, ProductContainerTitle, ProductField } from '@components/ui/Nebula/product-field';
import { SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectLabel, SelectItem, Select } from '@components/ui/Nebula/selector';

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
{/* 
        <Select>
            <SelectTrigger style={{width:"100%", maxWidth:"calc(var(--spacing)*48)"}}>
                <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Fruits</SelectLabel>
                    <SelectItem value="apple">Apple</SelectItem>
                    <SelectItem value="banana">Banana</SelectItem>
                    <SelectItem value="blueberry">Blueberry</SelectItem>
                    <SelectItem value="grapes">Grapes</SelectItem>
                    <SelectItem value="pineapple">Pineapple</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select> */}

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

import style from '@styles/features/filterbar.module.scss';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Icon, Button, ButtonGroup, Label } from '@components/ui/NebulaUI';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@components/ui/Nebula/selector';

const FilterBar: React.FC = () => {
    const router = useRouter();
    const pathName = usePathname();
    const searchParams = useSearchParams();
    const currentParams = new URLSearchParams(searchParams.toString());
    const sortType = searchParams.get('sort') || 'relevance';
    

    return (
        <div className={style.filterBar}>
            <ButtonGroup>
                <Label>Sorted By</Label>
                <ButtonGroup>
                    <Button
                        variant={sortType === 'relevance' ? "default" : "secondary"}
                        size={"sm"}
                        onClick={() => {
                            currentParams.set('sort', 'relevance');
                            router.push(`${pathName}?${currentParams.toString()}`);
                    }}>Relevance</Button>
                </ButtonGroup>
                <ButtonGroup>
                    <Button
                        variant={sortType === 'recent' ? "default" : "secondary"}
                        size={"sm"}
                        onClick={() => {
                            currentParams.set('sort', 'recent');
                            router.push(`${pathName}?${currentParams.toString()}`);
                    }}>Most Recent</Button>
                </ButtonGroup>
                <ButtonGroup>
                    <Select 
                        value={sortType === 'price_asc' || sortType === 'price_desc' ? sortType : ""}
                        onValueChange={(val) => {
                            currentParams.set('sort', val);
                            router.push(`${pathName}?${currentParams.toString()}`)
                        }}
                    >
                        <SelectTrigger
                            className={(sortType === 'price_asc' || sortType === 'price_desc') ? style.active : ""}
                            style={{color: "var(--secondary-foreground)", backgroundColor: "var(--secondary)",borderRadius: "var(--radius-small)",minWidth: "calc(var(--spacing)*48)"}}>
                            <SelectValue placeholder="Select Price Range"/>
                        </SelectTrigger>
                        <SelectContent position='popper'>
                            <SelectGroup>
                                <SelectLabel>Price</SelectLabel>
                                <SelectItem value='price_asc'>Low to High</SelectItem>
                                <SelectItem value='price_desc'>High to Low</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </ButtonGroup>
            </ButtonGroup>
            <div className={style.filterPages}>
                <p>Page 1 of 7</p>
                <div className={style.pageButtons}>
                    <Button size={"icon"} variant={"secondary"} asChild>
                        <Icon></Icon>
                    </Button>
                    <Button size={"icon"} variant={"secondary"} asChild>
                        <Icon></Icon>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default FilterBar;
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import style from '@styles/features/advancefilter.module.scss';
import { Field, FieldLabel, FieldSeparator, FieldLegend, FieldGroup, Icon, Checkbox, Button, Input, Separator } from '@components/ui/NebulaUI';
import { RadioGroup, RadioGroupItem } from '@components/ui/Nebula/radio';
import { useState } from 'react';
import Form from 'next/form';
import { ratingStars } from '@lib/utils';

const AdvanceFilter: React.FC = () => {
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');

    const router = useRouter();
    const pathName = usePathname();
    const searchParams = useSearchParams();
    const currentParams = new URLSearchParams(searchParams.toString());

    return (
        <div className={style.advanceFilter}>
            <h3><Icon>󰈲</Icon> Advance Filter</h3>

            <Field>
                <FieldLegend>Based of Category</FieldLegend>
                <FieldGroup style={{gap: "calc(var(--spacing) * 2)"}}>
                    <Field orientation={"horizontal"}>
                        <Checkbox name='book' id='book' />
                        <FieldLabel htmlFor='book'>Books</FieldLabel>
                    </Field>
                    <Field orientation={"horizontal"}>
                        <Checkbox name='book' id='electronics' />
                        <FieldLabel htmlFor='electronics'>Electronics</FieldLabel>
                    </Field>
                    <Field orientation={"horizontal"}>
                        <Checkbox name='book' id='clothing' />
                        <FieldLabel htmlFor='clothing'>Clothing</FieldLabel>
                    </Field>
                    <Field orientation={"horizontal"}>
                        <Checkbox name='book' id='furniture' />
                        <FieldLabel htmlFor='furniture'>Furniture</FieldLabel>
                    </Field>
                </FieldGroup>

                <FieldSeparator/>

                <FieldLegend>Store Rating</FieldLegend>
                <FieldGroup>
                    <RadioGroup onValueChange={(val) => {
                        const params = new URLSearchParams(currentParams.toString());
                        params.set('rating', val);
                        router.push(`${pathName}?${params.toString()}`, {scroll: false});
                    }}>
                        <Field orientation={"horizontal"}>
                            <RadioGroupItem value='4.75' id='rating_5' className={style.srOnly} />
                            <FieldLabel htmlFor='rating_5'>
                                <Icon className={style.starRating}>{ratingStars(5)}</Icon>
                            </FieldLabel>
                        </Field>
                        <Field orientation={"horizontal"}>
                            <RadioGroupItem value='3.75' id='rating_4' className={style.srOnly} />
                            <FieldLabel htmlFor='rating_4'>
                                <Icon className={style.starRating}>{ratingStars(4)}</Icon>
                                and up
                            </FieldLabel>
                        </Field>
                        <Field orientation={"horizontal"}>
                            <RadioGroupItem value='2.75' id='rating_3' className={style.srOnly} />
                            <FieldLabel htmlFor='rating_3'>
                                <Icon className={style.starRating}>{ratingStars(3)}</Icon>
                                and up
                            </FieldLabel>
                        </Field>
                        <Field orientation={"horizontal"}>
                            <RadioGroupItem value='1.75' id='rating_2' className={style.srOnly} />
                            <FieldLabel htmlFor='rating_2'>
                                <Icon className={style.starRating}>{ratingStars(2)}</Icon>
                                and up
                            </FieldLabel>
                        </Field>
                        <Field orientation={"horizontal"}>
                            <RadioGroupItem value='0.75' id='rating_1' className={style.srOnly} />
                            <FieldLabel htmlFor='rating_1'>
                                <Icon className={style.starRating}>{ratingStars(1)}</Icon>
                                and up
                            </FieldLabel>
                        </Field>
                    </RadioGroup>
                </FieldGroup>

                <FieldSeparator/>
            
                <FieldLegend>Price Range</FieldLegend>

                <Form action={"/search"} onSubmit={(e) => {
                    e.preventDefault();
                    const params = new URLSearchParams(currentParams.toString());
                    if (minPrice) params.set('min_price', minPrice);
                    else params.delete('min_price');
                    if (maxPrice) params.set('max_price', maxPrice);
                    else params.delete('max_price');
                    router.replace(
                        `${pathName}?${params.toString()}`,
                        { scroll: false }
                    );
                }}>
                    <FieldGroup>
                        <Field orientation="horizontal">
                            <Input type="number" name='min_price' placeholder="MIN" min={0} value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)} />

                            <Separator style={{ width: "15%" }} />

                            <Input type="number" name='max_price' placeholder="MAX" min={0} value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)} />
                        </Field>

                        <Button variant="oppose" size="sm" type="submit">
                            Apply
                        </Button>
                    </FieldGroup>
                </Form>

            </Field>
        </div>
    )
}

export default AdvanceFilter;
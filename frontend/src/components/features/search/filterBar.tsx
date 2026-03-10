import style from '@styles/features/filterbar.module.scss';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Icon, Button } from '@components/ui/NebulaUI';

const FilterBar: React.FC<{ page: number; totalPages: number }> = ({ page, totalPages }) => {
    const router = useRouter();
    const pathName = usePathname();
    const searchParams = useSearchParams();

    const currentParams = new URLSearchParams(searchParams.toString());

    const changePage = (nextPage: number) => {
        currentParams.set("page", String(nextPage));
        router.push(`${pathName}?${currentParams.toString()}`);
    };

    const prevPage = () => {
        if (page > 0) changePage(page - 1);
    };

    const nextPage = () => {
        if (page < totalPages - 1) changePage(page + 1);
    };

    return (
        <div className={style.filterBar}>
            <div className={style.filterPages}>
                <p>Page {page + 1} of {totalPages}</p>

                <div className={style.pageButtons}>
                    <Button
                        size={"icon"}
                        variant={"secondary"}
                        disabled={page === 0}
                        onClick={prevPage}
                    >
                        <Icon></Icon>
                    </Button>

                    <Button
                        size={"icon"}
                        variant={"secondary"}
                        disabled={page >= totalPages - 1}
                        onClick={nextPage}
                    >
                        <Icon></Icon>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default FilterBar;
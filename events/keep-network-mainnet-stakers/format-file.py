import json

KEEP_EVENT_ID = 580

def main():
    print('> Starting KEEP network Ethereum stakers')
    formatted_output = {}
    with open('original.txt') as original_file:
        for each in original_file:
            address = each.strip().replace('"', '').lower()
            formatted_output[address] = [KEEP_EVENT_ID, ]

    with open('output.json', 'w') as outfile:
        json.dump(formatted_output, outfile, indent=4)

    original_file_length = sum(1 for line in open('original.txt', 'r') if line.strip())
    original_file_without_duplicates_length = len(set(line for line in open('original.txt', 'r') if line.strip()))
    print('')
    print('>> Amount from original file:', original_file_length)
    print('>> Amount without duplicates from original file:', original_file_without_duplicates_length)
    print('>> Amount of addresses formatted:', len(formatted_output))
    amount_validation = 'SUCCESS' if len(formatted_output) == original_file_without_duplicates_length else 'ERROR'
    print('>>> Amount validation:', amount_validation)
    print('')

    print('> End of script')

if __name__ == '__main__':
    main()

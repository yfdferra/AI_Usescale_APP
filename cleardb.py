ans = input('type "confirm" clear databases')
if ans == 'confirm':
    import os
    
    for i in os.listdir('./database'):
        if i.endswith('.db'):
            os.remove('./database/'+i)
            print(f'removed {i}')